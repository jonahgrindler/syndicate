import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  getDBConnection,
  createTables,
  setupSettingsTable,
  initializeDataIfNeeded,
  getFeeds,
  insertPost,
  fetchPostsForFeed,
  insertFeed,
  getSavedPosts,
  savePost,
  unsavePost,
  parseFeed,
} from '../database';
import * as rssParser from 'react-native-rss-parser';
import {Post} from '../types/FeedTypes';

const FeedContext = createContext({
  feeds: [],
  feedData: [],
  visibleFeeds: {},
  toggleFeedVisibility: () => {},
  refreshFeeds: () => {},
  addNewFeed: () => {},
  fetchAndStoreFeeds: () => {},
  allPosts: [],
  loadAllPosts: async () => {},
  savedPosts: [],
  handleSavePost: () => {},
  handleUnsavePost: () => {},
  getSavedPosts: () => {},
});

export const FeedProvider = ({children}) => {
  const [feeds, setFeeds] = useState<any>([]);
  const [feedData, setFeedData] = useState<any>([]);
  const [visibleFeeds, setVisibleFeeds] = useState<any>({});
  const [allPosts, setAllPosts] = useState<any>([]);
  const [savedPosts, setSavedPosts] = useState<any>([]);

  // Initialize and load feeds
  useEffect(() => {
    const initializeAndLoadFeeds = async () => {
      const db = await getDBConnection();
      await createTables(db);
      await setupSettingsTable(db);
      await initializeDataIfNeeded(db);
      await fetchAndStoreFeeds();
    };
    initializeAndLoadFeeds();
  }, []);

  const fetchAndStoreFeeds = async () => {
    const db = await getDBConnection();
    const feeds = await getFeeds(db);
    const feedsWithPosts = [];

    for (const feed of feeds) {
      // const response = await fetch(feed.channel_url);
      // const responseData = await response.text();
      // const parsed = await rssParser.parse(responseData);
      const parsed = await parseFeed(feed.channel_url);
      // console.log('parsed:', parsed);

      const posts = [];
      for (const item of parsed.items) {
        console.log('item.imageUrl:', item.imageUrl);
        const uniqueId = item.id || `${feed.channel_url}-${item.title}`;
        const link = item.links[0].url;
        await insertPost(
          db,
          feed.channel_url,
          item.title,
          link,
          item.description,
          item.published,
          item.imageUrl,
          uniqueId,
        );
        posts.push({
          title: item.title,
          link: link,
          description: item.description,
          published: item.published,
          imageUrl: item.imageUrl,
          post_unique_id: uniqueId,
        });
      }
      feedsWithPosts.push({
        ...feed,
        title: parsed.title,
        posts: posts,
        image: parsed.image?.url,
      });
    }

    setFeeds(feeds); // This keeps a record of feed metadata
    setFeedData(feedsWithPosts); // This sets the data with posts included

    // Initialize visibility state
    const visibility = feeds.reduce((acc, feed) => {
      acc[feed.id] = false; // Initially all feeds are hidden
      return acc;
    }, {});
    setVisibleFeeds(visibility);
  };

  const toggleFeedVisibility = id => {
    setVisibleFeeds(prev => ({...prev, [id]: !prev[id]}));
  };

  // Add
  const addNewFeed = async (url: string | URL | Request) => {
    const db = await getDBConnection();
    const response = await fetch(url);
    const responseData = await response.text();
    const parsed = await rssParser.parse(responseData);

    await insertFeed(db, {
      channel_url: url,
      title: parsed.title,
      image: parsed.image.url,
    });

    parsed.items.forEach(async item => {
      await insertPost(
        db,
        url,
        item.title,
        item.description,
        item.published,
        item.id || `${url}-${item.title}`, // Ensuring uniqueness
      );
    });

    await refreshFeeds(); // Optionally refresh the feed list after adding a new feed
  };

  const refreshFeeds = async () => {
    await fetchAndStoreFeeds();
  };

  // const refreshFeeds = async () => {
  //   const db = await getDBConnection();
  //   const updatedFeeds = await getFeeds(db);
  //   setFeeds(updatedFeeds);
  // };

  const loadAllPosts = async () => {
    const db = await getDBConnection();
    const feeds = await getFeeds(db);
    // let posts = [];
    // let posts: Post[] = [];
    let posts: any[] = [];

    for (const feed of feeds) {
      const fetchedPosts = await fetchPostsForFeed(db, feed.id);
      posts = posts.concat(
        fetchedPosts.map(post => ({...post, feedTitle: feed.title})),
      );
    }

    posts.sort((a, b) => new Date(b.published) - new Date(a.published)); // Sort posts by date
    setAllPosts(posts);
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  // Saved Posts
  useEffect(() => {
    const loadPosts = async () => {
      const db = await getDBConnection();
      const posts = await getSavedPosts(db);
      setSavedPosts(posts);
    };
    loadPosts();
  }, []);

  const handleSavePost = async (postId: any) => {
    const db = await getDBConnection();
    await savePost(db, postId);
    const updatedSavedPosts = await getSavedPosts(db); // Fetch updated list of saved posts
    setSavedPosts(updatedSavedPosts); // Update the state with the new list of saved posts
  };

  const handleUnsavePost = async (postId: any) => {
    const db = await getDBConnection();
    await unsavePost(db, postId);
    const updatedSavedPosts = await getSavedPosts(db); // Fetch updated list of saved posts
    setSavedPosts(updatedSavedPosts); // Update the state with the new list of saved posts
  };

  return (
    <FeedContext.Provider
      value={{
        feeds,
        feedData,
        visibleFeeds,
        toggleFeedVisibility,
        addNewFeed,
        refreshFeeds,
        allPosts,
        loadAllPosts,
        savedPosts,
        handleSavePost,
        handleUnsavePost,
      }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);

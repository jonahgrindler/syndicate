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
  insertPosts,
  getSavedPosts,
  savePost,
  unsavePost,
  postExistsInDB,
  countNewPosts,
  markPostsAsSeen,
  updateUnseenCount,
  parseFeed,
  deleteFeed,
  viewFeed,
} from '../database';
import * as rssParser from 'react-native-rss-parser';
import {Post} from '../types/FeedTypes';

const FeedContext = createContext({
  feeds: [],
  feedData: [],
  selectedFeedId: [],
  visibleFeeds: {},
  toggleFeedVisibility: () => {},
  handleOpenFeed: () => {},
  handleSelectedFeedId: () => {},
  refreshFeeds: () => {},
  addNewFeed: () => {},
  fetchAndStoreFeeds: () => {},
  allPosts: [],
  loadAllPosts: async () => {},
  savedPosts: [],
  handleSavePost: () => {},
  handleUnsavePost: () => {},
  getSavedPosts: () => {},
  postExistsInDB: () => {},
  countNewPosts: () => {},
  markPostsAsSeen: () => {},
  updateUnseenCount: () => {},
  handleDelete: () => {},
  showSettings: {},
  loading: true,
  setLoading: () => {},
});

export const FeedProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<any>([]);
  const [feedData, setFeedData] = useState<any>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<any>([]);
  const [visibleFeeds, setVisibleFeeds] = useState<any>({});
  const [allPosts, setAllPosts] = useState<any>([]);
  const [savedPosts, setSavedPosts] = useState<any>([]);
  const [posts, setPosts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize and load feeds
  useEffect(() => {
    const initializeAndLoadFeeds = async () => {
      setLoading(true);
      const db = await getDBConnection();
      await createTables(db);
      await setupSettingsTable(db);
      await initializeDataIfNeeded(db);
      await fetchAndStoreFeeds();
      setLoading(false);
    };
    initializeAndLoadFeeds();
  }, []);

  const fetchAndStoreFeeds = async () => {
    setLoading(true);
    const db = await getDBConnection();
    const feeds = await getFeeds(db);
    const feedsWithPosts = [];

    for (const feed of feeds) {
      const parsed = await parseFeed(feed.channel_url);

      const posts = [];
      for (const item of parsed.items) {
        // console.log('item.imageUrl:', item.imageUrl);
        const uniqueId = item.id || `${feed.channel_url}-${item.title}`;
        // const link = item.links[0].url;
        const link = item.links && item.links[0] ? item.links[0].url : '';
        console.log(
          'processing post:',
          item.title,
          'unique ID:',
          uniqueId,
          'Link:',
          link,
        );
        const postExists = await postExistsInDB(db, uniqueId);
        if (!postExists) {
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
          // newPostsCount += 1;
        }
        posts.push({
          title: item.title,
          link: link,
          description: item.description,
          published: item.published,
          imageUrl: item.imageUrl,
          post_unique_id: uniqueId,
        });
      }
      // Sort posts by date
      posts.sort((a, b) => new Date(b.published) - new Date(a.published));

      const unseenCount = await countNewPosts(db, feed.id);

      feedsWithPosts.push({
        ...feed,
        title: parsed.title,
        posts: posts,
        image: parsed.image?.url,
        unseenCount: unseenCount,
        // unseenCount: newPostsCount,
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

    setLoading(false);
  };

  const toggleFeedVisibility = id => {
    setVisibleFeeds(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleOpenFeed = async (feedId: any) => {
    setVisibleFeeds(prev => ({...prev, [feedId]: !prev[feedId]}));
    const db = await getDBConnection();
    await viewFeed(db, feedId);
  };

  // Add
  const addNewFeed = async channelUrl => {
    const db = await getDBConnection();
    const parsed = await parseFeed(channelUrl);

    await insertFeed(db, {
      channel_url: channelUrl,
      title: parsed.title,
      image: parsed.image.url,
    });
    await insertPosts(db, channelUrl, parsed.items);
    await refreshFeeds();
  };

  const refreshFeeds = async () => {
    await fetchAndStoreFeeds();
  };

  const handleSelectedFeedId = async feedId => {
    setSelectedFeedId(feedId);
    const db = await getDBConnection();
    await markPostsAsSeen(db, feedId);
    await updateUnseenCount(db, feedId, 0);
    await fetchAndStoreFeeds();
  };

  useEffect(() => {
    const loadPosts = async () => {
      if (selectedFeedId === 'saved') {
        console.log('Nav: saved');
        setShowSettings(false);
        const db = await getDBConnection();
        const savedPostsList = await getSavedPosts(db);
        setSavedPosts(savedPostsList);
        setPosts(savedPosts);
      } else if (selectedFeedId === 'settings') {
        // Show Settings, hide feed
        setPosts([]);
        setShowSettings(true);
      } else if (selectedFeedId === 'everything') {
        // Show all posts
        setShowSettings(false);
        setPosts(allPosts);
      } else if (selectedFeedId) {
        // Show a feed
        setShowSettings(false);
        const db = await getDBConnection();
        const loadedPosts = await fetchPostsForFeed(db, selectedFeedId);
        setPosts(loadedPosts);
      } else {
        setShowSettings(false);
        setPosts([]);
      }
    };

    loadPosts();
  }, [selectedFeedId]);

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

  const handleDelete = async (feedId: any) => {
    const db = await getDBConnection();
    await deleteFeed(db, feedId);
    await refreshFeeds();
  };

  return (
    <FeedContext.Provider
      value={{
        feeds,
        feedData,
        selectedFeedId,
        handleSelectedFeedId,
        posts,
        visibleFeeds,
        toggleFeedVisibility,
        addNewFeed,
        refreshFeeds,
        allPosts,
        loadAllPosts,
        savedPosts,
        handleSavePost,
        handleUnsavePost,
        handleOpenFeed,
        handleDelete,
        showSettings,
        loading,
      }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);

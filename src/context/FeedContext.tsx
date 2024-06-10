import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  getDBConnection,
  createTables,
  createSettingsTable,
  getSetting,
  saveSetting,
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
  toggleShowInEverything,
  renameFeed,
  deleteFeed,
  viewFeed,
  insertFolder,
  updateFolder,
  deleteFolder,
  addFeedToFolder,
  removeFeedFromFolder,
  getFeedsInFolder,
  getFeedsNotInFolder,
  getAllFolders,
} from '../database';
import * as rssParser from 'react-native-rss-parser';
import {Post} from '../types/FeedTypes';
import {saveData} from '../utilities/asyncHelper';
import formatDate from '../utilities/formatDate';

const FeedContext = createContext({
  feeds: [],
  feedData: [],
  selectedFeedId: [],
  setSelectedFeedId: () => {},
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
  toggleFeedShowInEverything: () => {},
  handleRenameFeed: () => {},
  handleDelete: () => {},
  showSettings: {},
  linkBehavior: 'webview',
  setLinkBehavior: () => {},
  loading: true,
  setLoading: () => {},
  // Folders
  folders: [],
  folderFeeds: [],
  selectedFolderTitle: '',
  handleCreateFolder: () => {},
  handleUpdateFolder: () => {},
  handleDeleteFolder: () => {},
  handleAddFeedToFolder: () => {},
  handleRemoveFeedFromFolder: () => {},
  handleGetFeedsInFolder: () => {},
  handleSelectFolder: () => {},
  handleBackFromFolder: () => {},
  allFolderPosts: [],
});

export const FeedProvider = ({children}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [feeds, setFeeds] = useState<any>([]);
  const [feedData, setFeedData] = useState<any>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<any>([]);
  const [visibleFeeds, setVisibleFeeds] = useState<any>({});
  const [allPosts, setAllPosts] = useState<any>([]);
  const [savedPosts, setSavedPosts] = useState<any>([]);
  const [posts, setPosts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [folders, setFolders] = useState([]);
  const [isFolderView, setIsFolderView] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderFeeds, setFolderFeeds] = useState([]);
  const [allFolderPosts, setAllFolderPosts] = useState([]);
  const [selectedFolderTitle, setSelectedFolderTitle] = useState('');
  const [linkBehavior, setLinkBehavior] = useState('webview');

  // Initialize and load feeds
  useEffect(() => {
    const initializeAndLoadFeeds = async () => {
      setLoading(true);
      const db = await getDBConnection();
      await createTables(db);
      await createSettingsTable(db);
      await initializeDataIfNeeded(db);
      await fetchAndStoreFeeds();
      const allFolders = await getAllFolders(db);
      setFolders(allFolders);
      setLoading(false);
    };
    initializeAndLoadFeeds();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const db = await getDBConnection();
      await createSettingsTable(db);
      const linkBehaviorSetting = await getSetting(db, 'linkBehavior');
      setLinkBehavior(linkBehaviorSetting || 'webview');
    };
    loadSettings();
  }, []);

  const toggleLinkBehavior = async () => {
    const newBehavior = linkBehavior === 'webview' ? 'browser' : 'webview';
    await saveSetting('linkBehavior', newBehavior);
    setLinkBehavior(newBehavior);
  };

  const fetchAndStoreFeeds = async () => {
    setLoading(true);
    const db = await getDBConnection();
    // const feeds = await getFeeds(db);
    const feedsNotInFolder = await getFeedsNotInFolder(db);
    const feedsWithPosts = [];

    for (const feed of feedsNotInFolder) {
      const parsed = await parseFeed(feed.channel_url);
      const posts = [];

      for (const item of parsed.items) {
        const formattedDate = formatDate(item.published);
        await insertPost(
          db,
          feed.channel_url,
          item.title,
          item.link,
          item.description,
          item.published,
          item.imageUrl,
          item.uniqueId,
        );
        posts.push({
          title: item.title,
          link: item.link,
          description: item.description,
          published: item.published,
          formattedDate: formattedDate,
          imageUrl: item.imageUrl,
          post_unique_id: item.uniqueId,
        });
      }
      // Sort posts by date
      posts.sort((a, b) => new Date(b.published) - new Date(a.published));

      const unseenCount = await countNewPosts(db, feed.id);
      await updateUnseenCount(db, feed.id, unseenCount);

      feedsWithPosts.push({
        ...feed,
        title: feed.custom_title || parsed.title,
        posts: posts,
        image: parsed.image?.url,
        unseenCount: unseenCount,
      });
    }

    setFeeds(feedsNotInFolder);
    setFeedData(feedsWithPosts);

    // Initialize visibility state
    const visibility = feeds.reduce((acc, feed) => {
      acc[feed.id] = false; // Initially all feeds are hidden
      return acc;
    }, {});
    setVisibleFeeds(visibility);

    setLoading(false);

    // Async Storage
    // await saveData('feedData', feedsWithPosts);
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
    await loadAllPosts();
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
      const db = await getDBConnection();
      // console.log('selectedFeedId', selectedFeedId);

      if (!selectedFeedId) {
        setShowSettings(false);
        setPosts([]);
        return;
      }

      if (selectedFeedId === 'saved') {
        console.log('Nav: saved');
        setShowSettings(false);
        const savedPostsList = await getSavedPosts(db);
        setSavedPosts(savedPostsList);
        setPosts(savedPosts);
      } else if (selectedFeedId === 'settings') {
        // Show Settings, hide feed
        setPosts([]);
        setShowSettings(true);
      } else if (selectedFeedId === 'everything') {
        // Show all posts (that aren't excluded)
        setShowSettings(false);
        setPosts(allPosts);
      } else if (
        typeof selectedFeedId === 'string' &&
        selectedFeedId.startsWith('all-')
      ) {
        setShowSettings(false);
        console.log('selectedFeedId', selectedFeedId);
        if (selectedFeedId.startsWith('all-')) {
          // Load posts from all feeds in the folder
          const folderId = currentFolder.split('-')[1];
          await handleGetFeedsInFolder(folderId, selectedFolderTitle);
          setPosts(allFolderPosts);
        }
      } else {
        console.log('selectedFeedId', selectedFeedId);
        setShowSettings(false);
        const loadedPosts = await fetchPostsForFeed(db, selectedFeedId);
        setPosts(loadedPosts);
      }
    };

    loadPosts();
  }, [selectedFeedId, feedData]);

  const loadAllPosts = async () => {
    const db = await getDBConnection();
    const feeds = await getFeeds(db);
    let posts: any[] = [];

    for (const feed of feeds) {
      if (feed.show_in_everything) {
        const fetchedPosts = await fetchPostsForFeed(db, feed.id);
        posts = posts.concat(
          fetchedPosts.map(post => ({...post, feedTitle: feed.title})),
        );
      }
    }

    posts.sort((a, b) => new Date(b.published) - new Date(a.published)); // Sort posts by date
    setAllPosts(posts);
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  const toggleFeedShowInEverything = async (feedId, currentValue) => {
    const db = await getDBConnection();
    console.log('ToggleFeedShowInEverything', feedId, currentValue);
    await toggleShowInEverything(db, feedId, currentValue);
    await refreshFeeds();
    await loadAllPosts();
  };

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

  const handleRenameFeed = async (feedId, newTitle) => {
    const db = await getDBConnection();
    renameFeed(db, feedId, newTitle);
    // console.log('renamed:', feedId, newTitle);
    await refreshFeeds();
  };

  const handleDelete = async (feedId: any) => {
    const db = await getDBConnection();
    await deleteFeed(db, feedId);
    await refreshFeeds();
  };

  // Folders
  const handleCreateFolder = async folderName => {
    const db = await getDBConnection();
    await insertFolder(db, folderName);
    const allFolders = await getAllFolders(db);
    setFolders(allFolders);
    return folderId;
  };

  const handleUpdateFolder = async (folderId, newName) => {
    const db = await getDBConnection();
    await updateFolder(db, folderId, newName);
    const allFolders = await getAllFolders(db);
    setFolders(allFolders);
  };

  const handleDeleteFolder = async folderId => {
    const db = await getDBConnection();
    await deleteFolder(db, folderId);
    console.log('Deleted Folder:', folderId);
    const allFolders = await getAllFolders(db);
    setFolders(allFolders);
    const allFeeds = await getFeeds(db);
    setFeeds(allFeeds);
    await fetchAndStoreFeeds();
  };

  const handleAddFeedToFolder = async (folderId, feedId) => {
    const db = await getDBConnection();
    await addFeedToFolder(db, folderId, feedId);
    console.log('Added Feed', feedId, 'to Folder', folderId);
    fetchFolders();
  };

  const handleRemoveFeedFromFolder = async (folderId, feedId) => {
    const db = await getDBConnection();
    await removeFeedFromFolder(db, folderId, feedId);
  };

  const fetchFolders = async () => {
    const db = await getDBConnection();
    const allFolders = await getAllFolders(db);
    setFolders(allFolders);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleGetFeedsInFolder = async (folderId, folderTitle) => {
    const db = await getDBConnection();
    const feedsInFolder = await getFeedsInFolder(db, folderId);
    setFolderFeeds(feedsInFolder);
    setSelectedFolderTitle(folderTitle);

    let posts = [];
    for (const feed of feedsInFolder) {
      const feedPosts = await fetchPostsForFeed(db, feed.id);
      posts = posts.concat(feedPosts);
    }
    posts.sort((a, b) => new Date(b.published) - new Date(a.published));
    setAllFolderPosts(posts);
  };

  // const handleGetFeedsInFolder = async (folderId, folderTitle) => {
  //   const db = await getDBConnection();
  //   const feedsInFolder = await getFeedsInFolder(db, folderId);
  //   setFolderFeeds(feedsInFolder);
  //   setSelectedFolderTitle(folderTitle);
  // };

  const handleSelectFolder = folderId => {
    setIsFolderView(true);
    setCurrentFolder(folderId);
    setSelectedFeedId();
  };

  const handleBackFromFolder = () => {
    setIsFolderView(false);
    setCurrentFolder(null);
  };

  return (
    <FeedContext.Provider
      value={{
        // Feeds
        feeds,
        feedData,
        selectedFeedId,
        setSelectedFeedId,
        handleSelectedFeedId,
        posts,
        visibleFeeds,
        toggleFeedVisibility,
        addNewFeed,
        refreshFeeds,
        allPosts,
        loadAllPosts,
        // Saves
        savedPosts,
        handleSavePost,
        handleUnsavePost,
        handleOpenFeed,
        toggleFeedShowInEverything,
        handleRenameFeed,
        handleDelete,
        // Settings
        showSettings,
        linkBehavior,
        setLinkBehavior: toggleLinkBehavior,
        loading,
        // Folders
        folders,
        folderFeeds,
        allFolderPosts,
        setSelectedFeedId,
        selectedFolderTitle,
        handleCreateFolder,
        handleUpdateFolder,
        handleDeleteFolder,
        handleAddFeedToFolder,
        handleRemoveFeedFromFolder,
        handleGetFeedsInFolder,
        isFolderView,
        currentFolder,
        handleSelectFolder,
        handleBackFromFolder,
      }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);

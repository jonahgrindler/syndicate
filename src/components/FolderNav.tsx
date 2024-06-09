import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import {useFeed} from '../context/FeedContext';
import NavRow from './NavRow';

const FolderNav = ({folderId}) => {
  const {handleGetFeedsInFolder, toggleFeedVisibility, selectedFeedId} =
    useFeed();
  const [folderFeeds, setFolderFeeds] = useState([]);

  useEffect(() => {
    const fetchFolderFeeds = async () => {
      const db = await getDBConnection();
      const feeds = await handleGetFeedsInFolder(folderId, db);
      setFolderFeeds(feeds);
    };

    fetchFolderFeeds();
  }, [folderId]);

  const renderFeedItem = ({item}) => (
    <NavRow
      title={item.custom_title ? item.custom_title : item.title}
      selected={false}
      newCount={item.unseen_count}
      feedId={item.id}
      // isFolder={feed.isFolder}
    />
  );

  return (
    <View>
      <FlatList
        data={[{id: `all-${folderId}`, title: 'All'}, ...folderFeeds]} // Add 'All' to the list
        keyExtractor={item => item.id.toString()}
        renderItem={renderFeedItem}
      />
    </View>
  );
};

export default FolderNav;

import {MenuView} from '@react-native-menu/menu';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useFeed} from '../context/FeedContext';

const ChannelMenu = ({
  children,
  onDelete,
  feedId,
  feedTitle,
  currentShowInEverything,
}) => {
  const {toggleFeedShowInEverything, feedData} = useFeed();

  const selectedFeed = feedData.find(feed => feed.id === feedId);
  const handlePress = ({nativeEvent, id}) => {
    if (nativeEvent.event === 'toggleShowInEverything') {
      console.log('show everything?:', currentShowInEverything);
      toggleFeedShowInEverything(feedId, selectedFeed.show_in_everything);
      console.log('show everything?:', currentShowInEverything);
    }
    if (nativeEvent.event === 'destructive') {
      onDelete(feedId);
    }
  };

  return (
    <MenuView
      title={feedTitle}
      onPressAction={handlePress}
      actions={[
        {
          id: 'rename',
          title: 'Rename Feed',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: 'pencil',
            android: 'ic_menu_edit',
          }),
        },
        {
          id: 'toggleShowInEverything',
          title: currentShowInEverything
            ? 'Hide from Everything'
            : 'Show in Everything',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: currentShowInEverything ? 'eye.slash' : 'eye',
            android: currentShowInEverything ? 'ic_menu_view' : 'ic_menu_view',
          }),
        },
        {
          id: 'destructive',
          title: 'Delete Feed',
          attributes: {
            destructive: true,
          },
          image: Platform.select({
            ios: 'trash',
            android: 'ic_menu_delete',
          }),
        },
      ]}
      shouldOpenOnLongPress={true}>
      {children}
    </MenuView>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
  },
  menuContainer: {
    height: 80,
    width: 80,
    backgroundColor: 'red',
  },
});

export default ChannelMenu;

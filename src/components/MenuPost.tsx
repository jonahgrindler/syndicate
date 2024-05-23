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

const MenuPost = ({children, postId}) => {
  const {handleSavePost, handleUnsavePost, savedPosts} = useFeed();

  const handlePress = ({nativeEvent, id}) => {
    console.log('nativeEvent:', nativeEvent);
    if (nativeEvent.event === 'save') {
      console.log('saving..', id);

      handleSavePost(id);
    }
  };
  return (
    <MenuView
      onPressAction={handlePress}
      actions={[
        {
          id: 'save',
          title: 'Save Post',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: 'bookmark',
            android: 'ic_menu_edit',
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

export default MenuPost;

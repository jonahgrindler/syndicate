import {MenuView} from '@react-native-menu/menu';
import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useFeed} from '../context/FeedContext';

const MenuPost = ({children, postId}) => {
  const {handleSavePost, handleUnsavePost, savedPosts} = useFeed();

  const isSaved = savedPosts.some(post => post.post_unique_id === postId);

  const handlePress = ({nativeEvent, id}) => {
    if (nativeEvent.event === 'save') {
      handleSavePost(id);
    } else if (nativeEvent.event === 'unsave') {
      handleUnsavePost(id);
    }
  };

  return (
    <MenuView
      onPressAction={({nativeEvent}) => handlePress({nativeEvent, id: postId})}
      actions={[
        {
          id: isSaved ? 'unsave' : 'save',
          title: isSaved ? 'Unsave Post' : 'Save Post',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: isSaved ? 'bookmark.fill' : 'bookmark',
            android: isSaved ? 'ic_menu_delete' : 'ic_menu_edit',
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

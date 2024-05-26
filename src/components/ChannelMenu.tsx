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

const ChannelMenu = ({children, onDelete, feedId, feedTitle}) => {
  const handlePress = ({nativeEvent}) => {
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
          id: 'hide',
          title: 'Exclude in Everything',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: 'minus.circle',
            android: 'ic_menu_edit',
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

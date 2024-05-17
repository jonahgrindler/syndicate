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

const ChannelMenu = ({children, onDelete, feedId}) => {
  const handlePress = ({nativeEvent}) => {
    if (nativeEvent.event === 'destructive') {
      onDelete(feedId);
    }
  };
  return (
    <MenuView
      title="Menu Title"
      onPressAction={handlePress}
      actions={[
        {
          id: 'destructive',
          title: 'Remove Feed',
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

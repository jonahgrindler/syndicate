import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {MenuView} from '@react-native-menu/menu';

const FolderNavItem: React.FC<any> = ({
  title,
  selected,
  newCount,
  feedId,
  isFolder,
  folder,
}) => {
  const {
    handleSelectedFeedId,
    handleSelectFolder,
    selectedFeedId,
    handleDeleteFolder,
    handleGetFeedsInFolder,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();

  const handlePress = async (folderId, folderTitle) => {
    if (isFolder) {
      handleSelectFolder(`folder-${folder.id}`);
      handleGetFeedsInFolder(folderId, folderTitle);
      // console.log('folder title', folder.name);
    } else {
      handleSelectedFeedId(feedId);
    }
  };

  const handleMenuPress = ({nativeEvent, id}) => {
    if (nativeEvent.event === 'manage') {
      // Go to manage feeds inside folder
    }
    if (nativeEvent.event === 'destructive') {
      handleDeleteFolder(folder.id);
    }
    if (nativeEvent.event === 'rename') {
    }
  };

  return (
    <MenuView
      onPressAction={handleMenuPress}
      actions={[
        {
          id: 'rename',
          title: 'Rename Folder',
          attributes: {
            destructive: false,
          },
          image: Platform.select({
            ios: 'pencil',
            android: 'ic_menu_edit',
          }),
        },
        {
          id: 'manage',
          title: 'Manage Feeds',
          attributes: {
            destructive: false,
          },
        },
        {
          id: 'destructive',
          title: 'Delete Folder',
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
      <TouchableOpacity
        style={styles.navRow}
        onPress={() => handlePress(folder.id, folder.name)}>
        {/* <View
        style={[
          styles.dot,
          selectedFeedId === `folder-${folder.id}` && {
            backgroundColor: colors.primary,
          },
        ]}
      /> */}
        <Image
          source={require('../../assets/icons/folder.png')}
          tintColor={primaryColor}
        />
        <Text
          style={[
            styles.navText,
            selectedFeedId === `folder-${folder.id}` && {color: colors.primary},
          ]}>
          {folder.name}
        </Text>
      </TouchableOpacity>
    </MenuView>
  );
};

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    marginRight: 3,
  },
  navText: {
    fontSize: fonts.size.nav,
    lineHeight: fonts.lineHeight.nav,
    fontWeight: fonts.weight.semibold,
    letterSpacing: -0.2,
    color: colors.primary,
  },
});

export default FolderNavItem;

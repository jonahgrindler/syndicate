import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Feed from './Feed';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import HomeRow from './HomeRow';
import ResetDatabase from './ResetDatabase';
import ThemePicker from './ThemePicker';
import {useTheme} from '../styles/theme';
import ChannelMenu from './ChannelMenu';
import DashedLine from 'react-native-dashed-line';
import NavRow from './NavRow';
import NavButton from './NavButton';
import FolderNavItem from './FolderNavItem';
import FolderNav from './FolderNav';

const SideNav: React.FC = ({feedContent}) => {
  const {
    loading,
    setLoading,
    feedData,
    feeds,
    folders,
    folderFeeds,
    posts,
    refreshFeeds,
    isFolderView,
    currentFolder,
    selectedFolderTitle,
    handleBackFromFolder,
    handleGetFeedsInFolder,
    handleSelectedFeedId,
    handleSelectFolder,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeeds();
    setRefreshing(false);
  };

  // TODO : Show loading indicator when opening the app
  // TODO : Cache nav items and posts from last session
  return (
    <View
      style={[
        styles.safeAreaView,
        posts
          ? {backgroundColor: secondaryColor}
          : {backgroundColor: secondaryColor},
        // TODO : Change sideNav width when nothing is selected or user swipes toward right
      ]}>
      <ScrollView
        style={[{paddingTop: insets.top + 4, paddingLeft: insets.left}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
            progressViewOffset={insets.top}
          />
        }>
        {isFolderView ? (
          // SECTION: FOLDER CONTENTS
          <View style={styles.folderViewHeader}>
            <TouchableOpacity
              onPress={handleBackFromFolder}
              style={styles.back}>
              <Image
                source={require('../../assets/icons/chevron-left.png')}
                tintColor={primaryColor}
              />
              <Image
                source={require('../../assets/icons/folder.png')}
                tintColor={primaryColor}
              />
              <Text style={[styles.text, {color: primaryColor}]}>
                {selectedFolderTitle}
              </Text>
            </TouchableOpacity>
            <>
              {/* <FolderNav folderId={currentFolder} /> */}
              <NavRow
                title={'All'}
                selected={false}
                newCount={0}
                feedId={`all-${currentFolder}`}
              />
              {folderFeeds.map(feed => (
                <View key={feed.id} style={styles.channel}>
                  <NavRow
                    title={feed.custom_title ? feed.custom_title : feed.title}
                    selected={false}
                    newCount={feed.unseenCount}
                    feedId={feed.id}
                    // isFolder={feed.isFolder}
                  />
                </View>
              ))}
            </>
          </View>
        ) : (
          // SECTION: MAIN FEED LIST
          <>
            <NavRow
              title={'All'}
              selected={true}
              newCount={0}
              feedId={'everything'}
            />
            <NavRow
              title={'Saves'}
              selected={false}
              newCount={0}
              feedId={'saved'}
            />
            <NavRow
              title={'Settings'}
              selected={false}
              newCount={0}
              feedId={'settings'}
            />
            {/* SECTION: FEEDS */}
            {feeds.map(feed => (
              <View key={feed.id} style={styles.channel}>
                <NavRow
                  title={feed.custom_title ? feed.custom_title : feed.title}
                  selected={false}
                  newCount={feed.unseen_count}
                  feedId={feed.id}
                  // isFolder={feed.isFolder}
                />
              </View>
            ))}

            {/* SECTION: FOLDERS */}
            {folders.map(folder => (
              <React.Fragment key={folder.id}>
                <FolderNavItem folder={folder} isFolder={true} />
              </React.Fragment>
            ))}
          </>
        )}
      </ScrollView>
      <View style={[styles.buttons, {paddingBottom: insets.bottom}]}>
        <NavButton label={'Add'} buttonHeight={106} to={'AddFeed'} />
        <NavButton label={'Folder'} buttonHeight={36} to={'AddFolder'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 6,
    maxWidth: 142,
    // width: '100%',
    justifyContent: 'space-between',
  },
  buttons: {
    gap: 8,
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: fonts.lineHeight.nav,
  },
});

export default SideNav;

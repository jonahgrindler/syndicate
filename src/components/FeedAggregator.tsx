import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feed from './Feed';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import HomeRow from './HomeRow';
import ResetDatabase from './ResetDatabase';
import ThemePicker from './ThemePicker';
import {useTheme} from '../styles/theme';
import ChannelMenu from './ChannelMenu';

const FeedAggregator: React.FC = () => {
  const {
    feedData,
    visibleFeeds,
    toggleFeedVisibility,
    handleOpenFeed,
    allPosts,
    savedPosts,
    handleDelete,
  } = useFeed();
  const [showSaved, setShowSaved] = useState(false);
  const [showEverything, setShowEverything] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showDataReset, setShowDataReset] = useState(false);
  const {primaryColor, secondaryColor} = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeAreaView, {backgroundColor: secondaryColor}]}>
      <ScrollView
        style={[styles.scrollView, {backgroundColor: secondaryColor}]}
        contentInset={{top: spacing.rowDouble, bottom: spacing.rowDouble}}>
        <TouchableOpacity onPress={() => setShowEverything(toggle => !toggle)}>
          <HomeRow
            title={'Everything'}
            image={require('../../assets/icons/everything.png')}
          />
        </TouchableOpacity>
        <>{showEverything && <Feed feedContent={allPosts} />}</>
        <TouchableOpacity onPress={() => setShowSaved(toggle => !toggle)}>
          <HomeRow
            title={'Saved'}
            image={require('../../assets/icons/save.png')}
          />
        </TouchableOpacity>
        <>{showSaved && <Feed feedContent={savedPosts} />}</>
        <View style={styles.emptyRow} />
        {feedData.map(feed => (
          <View key={feed.id} style={styles.channel}>
            <ChannelMenu
              onDelete={handleDelete}
              feedId={feed.id}
              feedTitle={feed.title}>
              <TouchableOpacity
                onPress={() => handleOpenFeed(feed.id)}
                style={styles.titleRow}>
                <View style={styles.imgTitle}>
                  {feed.image ? (
                    <Image source={{uri: feed.image}} style={styles.favicon} />
                  ) : (
                    <View
                      style={[
                        styles.favicon,
                        {backgroundColor: feed.color || '#FF00FF'},
                      ]}
                    />
                  )}
                  <Text
                    style={[styles.title, {color: primaryColor}]}
                    numberOfLines={1}>
                    {feed.title || 'No Title Available'}
                  </Text>
                </View>
                <View style={styles.titleRowRight}>
                  {feed.unseenCount > 0 && (
                    <View style={styles.unseenCount}>
                      <View
                        style={[
                          styles.unseenCountBG,
                          {backgroundColor: primaryColor},
                        ]}
                      />
                      <Text
                        style={[styles.unseenCountText, {color: primaryColor}]}>
                        {feed.unseenCount} New
                      </Text>
                    </View>
                  )}
                  <Image
                    source={require('../../assets/icons/chevron.png')}
                    style={[
                      styles.chevron,
                      {
                        transform: [
                          {rotate: visibleFeeds[feed.id] ? '180deg' : '0deg'},
                        ],
                        tintColor: primaryColor,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </ChannelMenu>
            <>{visibleFeeds[feed.id] && <Feed feedContent={feed.posts} />}</>
          </View>
        ))}
        <View style={styles.emptyRow} />
        <TouchableOpacity onPress={() => setShowSettings(toggle => !toggle)}>
          <HomeRow
            title={'Settings'}
            image={require('../../assets/icons/ellipsis.png')}
          />
        </TouchableOpacity>
        <>
          {showSettings && (
            <>
              <TouchableOpacity
                onPress={() => setShowThemePicker(toggle => !toggle)}>
                <HomeRow
                  title={'Color Theme'}
                  image={require('../../assets/icons/ellipsis.png')}
                />
              </TouchableOpacity>
              {showThemePicker && <ThemePicker />}
              <TouchableOpacity
                onPress={() => setShowDataReset(toggle => !toggle)}>
                <HomeRow
                  title={'Data'}
                  image={require('../../assets/icons/ellipsis.png')}
                />
              </TouchableOpacity>
              {showDataReset && <ResetDatabase />}
            </>
          )}
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingTop: 0,
  },
  scrollView: {
    backgroundColor: colors.dark.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
  },
  imgTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  favicon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.primary,
    flexShrink: 1,
    flexGrow: 0,
    // width: '85%',
  },
  titleRowRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  unseenCount: {
    // backgroundColor: 'red',
    height: 22,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 5,
  },
  unseenCountBG: {
    opacity: 0.08,
    height: 22,
    width: '100%',
    flex: 1,
    position: 'absolute',
    borderRadius: 3,
    paddingHorizontal: 10,
  },
  unseenCountText: {
    paddingHorizontal: 5,
    fontSize: fonts.size.small,
    fontWeight: 600,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  channel: {
    flexGrow: 1,
    flexShrink: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  emptyRow: {
    height: spacing.row,
  },
});

export default FeedAggregator;

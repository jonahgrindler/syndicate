import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {getDBConnection, fetchPostsForFeed} from '../database';
import {FeedProps, FeedItem} from '../types/FeedTypes';
import {RootStackParamList} from '../types/RootStackParamList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DashedLine from 'react-native-dashed-line';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {useTheme} from '../styles/theme';
import Settings from './Settings';
import MenuPost from './MenuPost';
import formatDate from '../utilities/formatDate';

const SideFeed: React.FC<FeedProps> = () => {
  const {
    feedData,
    // allFolderPosts,
    feeds,
    posts,
    setPosts,
    showSettings,
    selectedFeedId,
    loadAllPosts,
    handleGetFeedsInFolder,
    currentFolder,
  } = useFeed();
  const {primaryColor, secondaryColor} = useTheme();
  const insets = useSafeAreaInsets();

  const flatListRef = useRef(null);

  useEffect(() => {
    if (selectedFeedId === 'everything') {
      loadAllPosts();
    }
  }, [selectedFeedId, feedData]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: false, offset: 0});
    }
  }, [posts]);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
    >();
  const handleNavigation = (item: FeedItem) => {
    if (item.link) {
      console.log('item link:', item.links);
      navigation.navigate('FeedWebView', {
        url: item.link,
        postId: item.post_unique_id,
      });
    } else {
      console.error('Post link is missing:', item);
    }
  };

  // Folders
  const [folderFeeds, setFolderFeeds] = useState([]);

  // Sort posts by date
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.published) - new Date(a.published),
  );

  // TODO : Improve formatDate.js for more cases

  return (
    <FlatList
      ref={flatListRef}
      style={[
        styles.scrollView,
        {paddingTop: insets.top + 8, paddingBottom: insets.bottom + 80},
      ]}
      data={sortedPosts}
      keyExtractor={item => item.post_id.toString()}
      renderItem={({item}) => (
        <MenuPost postId={item.post_unique_id}>
          <TouchableOpacity
            style={styles.postContainer}
            onPress={() => handleNavigation(item)}>
            <DashedLine
              dashLength={3}
              dashThickness={3}
              dashGap={5}
              dashColor={primaryColor}
              dashStyle={{borderRadius: 5, marginBottom: 8}}
            />
            {item.imageUrl ? (
              <Image source={{uri: item.imageUrl}} style={styles.postImage} />
            ) : null}
            <Text style={[styles.postTitle, {color: primaryColor}]}>
              {item.title}
            </Text>
            {selectedFeedId === 'everything' ? (
              <Text style={[styles.smallText, {color: primaryColor}]}>
                {item.custom_title ? item.custom_title : item.feedTitle},{` `}
                {formatDate(item.published)}
              </Text>
            ) : (
              <Text style={[styles.smallText, {color: primaryColor}]}>
                {formatDate(item.published)}
              </Text>
            )}
          </TouchableOpacity>
        </MenuPost>
      )}
    />
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingRight: 8,
    // width: 0,
  },
  feedHeading: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  feedTitle: {
    fontSize: fonts.size.small,
    textAlign: 'center',
  },
  postContainer: {
    // borderWidth: 2,
    borderRadius: 1,
    // borderStyle: 'dotted',
    borderColor: colors.primary,
    paddingTop: 0,
    paddingBottom: 48,
  },
  postTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: fonts.weight.semibold,
    color: colors.primary,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: fonts.weight.semibold,
    color: colors.primary,
    marginTop: 4,
  },
  postImage: {
    width: '100%',
    height: 'auto',
    marginBottom: 8,
    aspectRatio: 4 / 3,
  },
});

export default SideFeed;

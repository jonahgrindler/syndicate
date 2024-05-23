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
} from 'react-native';
import {FeedProps, FeedItem} from '../types/FeedTypes';
import {RootStackParamList} from '../types/RootStackParamList';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import DashedLine from 'react-native-dashed-line';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {useTheme} from '../styles/theme';
import Settings from './Settings';
import MenuPost from './MenuPost';

const SideFeed: React.FC<FeedProps> = ({feedContent}) => {
  const {feedData, posts, showSettings} = useFeed();
  const {primaryColor, secondaryColor} = useTheme();
  const insets = useSafeAreaInsets();

  const flatListRef = useRef(null);
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: false, offset: 0});
    }
  }, [posts]);
  // console.log(feedData[0].posts);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
    >();
  const handleNavigation = (item: FeedItem) => {
    console.log('item:', item);
    navigation.navigate('FeedWebView', {
      url: item.link,
      postId: item.post_unique_id,
    });
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        style={[styles.scrollView, {paddingTop: insets.top + 8}]}
        data={posts}
        keyExtractor={item => item.post_id.toString()}
        renderItem={({item}) => (
          <MenuPost postId={item.post_id}>
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
                <Image
                  source={{uri: item.imageUrl}}
                  style={[styles.postImage]}
                />
              ) : null}
              <Text style={[styles.postTitle, {color: primaryColor}]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </MenuPost>
        )}
      />
      {showSettings ? <Settings /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingRight: 8,
  },
  postContainer: {
    // borderWidth: 2,
    borderRadius: 1,
    // borderStyle: 'dotted',
    borderColor: colors.primary,
    paddingTop: 8,
    paddingBottom: 40,
  },
  postTitle: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: fonts.weight.semibold,
    color: colors.primary,
  },
  postImage: {
    width: '100%',
    height: 160,
    marginBottom: 8,
    borderRadius: 1,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.secondary,
  },
});

export default SideFeed;

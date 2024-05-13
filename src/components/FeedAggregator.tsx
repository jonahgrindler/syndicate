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
import {colors, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import HomeRow from './HomeRow';

const FeedAggregator: React.FC = () => {
  const {feedData, visibleFeeds, toggleFeedVisibility, allPosts} = useFeed();
  const [showSaved, setShowSaved] = useState(false);
  const [showEverything, setShowEverything] = useState(false);
  console.log(feedData);

  return (
    <SafeAreaView edges={['top']} style={styles.safeAreaView}>
      <ScrollView
        style={styles.scrollView}
        contentInset={{top: spacing.rowDouble, bottom: spacing.rowDouble}}>
        <TouchableOpacity
          onPress={() => setShowEverything(toggle => !toggle)}
          style={styles.titleRow}>
          <View style={styles.imgTitle}>
            <Image
              source={require('../../assets/icons/everything.png')}
              style={styles.favicon}
            />
            <Text style={styles.title}>Everything</Text>
          </View>
          <Image
            source={require('../../assets/icons/chevron.png')}
            style={[styles.chevron]}
          />
        </TouchableOpacity>
        <>{showEverything && <Feed feedContent={allPosts} />}</>
        <TouchableOpacity
          onPress={() => setShowSaved(toggle => !toggle)}
          style={styles.titleRow}>
          <View style={styles.imgTitle}>
            <Image
              source={require('../../assets/icons/save.png')}
              style={styles.favicon}
            />
            <Text style={styles.title}>Saved</Text>
          </View>
          <Image
            source={require('../../assets/icons/chevron.png')}
            style={[styles.chevron]}
          />
        </TouchableOpacity>
        <>{showSaved && <Feed feedContent={feedData} />}</>
        <View style={styles.emptyRow} />
        {feedData.map(feed => (
          <View key={feed.id} style={styles.channel}>
            <TouchableOpacity
              onPress={() => toggleFeedVisibility(feed.id)}
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
                <Text style={styles.title}>
                  {feed.title || 'No Title Available'}
                </Text>
              </View>
              <Image
                source={require('../../assets/icons/chevron.png')}
                style={[
                  styles.chevron,
                  {
                    transform: [
                      {rotate: visibleFeeds[feed.id] ? '180deg' : '0deg'},
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
            <>{visibleFeeds[feed.id] && <Feed feedContent={feed.posts} />}</>
          </View>
        ))}
        <View style={styles.emptyRow} />
        <HomeRow
          title={'Settings'}
          image={require('../../assets/icons/ellipsis.png')}
        />
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
    marginLeft: 16,
    marginRight: 16,
  },
  imgTitle: {
    flexDirection: 'row',
    alignItems: 'center',
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

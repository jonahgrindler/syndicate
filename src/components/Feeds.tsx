// FeedAggregator.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feed from './Feed';
import feedsConfig from '../../feedsConfig';
import * as rssParser from 'react-native-rss-parser';

const Feeds: React.FC = () => {
  const [visibleFeeds, setVisibleFeeds] = useState<{[key: string]: boolean}>(
    feedsConfig.reduce((acc, feed) => {
      acc[feed.id] = false; // Initially all feeds are hidden
      return acc;
    }, {} as {[key: string]: boolean}),
  );
  const [feedData, setFeedData] = useState<any[]>([]);

  // Toggle visibility of a feed
  const toggleFeedVisibility = (id: string) => {
    setVisibleFeeds(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      const parsedFeeds = await Promise.all(
        feedsConfig.map(async feed => {
          const response = await fetch(feed.url);
          const responseData = await response.text();
          const parsed = await rssParser.parse(responseData);
          return {
            ...feed,
            parsed,
          };
        }),
      );
      setFeedData(parsedFeeds);
    };

    fetchFeeds();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {feedData.map(feed => (
        <View key={feed.id}>
          <TouchableOpacity
            onPress={() => toggleFeedVisibility(feed.id)}
            style={styles.titleRow}>
            <View style={styles.imgTitle}>
              {feed.parsed.image && (
                <Image
                  source={{uri: feed.parsed.image.url}}
                  style={styles.favicon}
                />
              )}
              <Text style={styles.title}>{feed.title}</Text>
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
          {visibleFeeds[feed.id] && <Feed feedContent={feed.parsed} />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
    backgroundColor: 'white',
    paddingTop: 16,
    paddingBottom: 88,
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chevron: {
    width: 16,
    height: 16,
  },
});

export default Feeds;

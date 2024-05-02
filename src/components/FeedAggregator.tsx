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
import AddFeed from './AddFeed';
import feedsConfig from '../../feedsConfig';
import * as rssParser from 'react-native-rss-parser';

const FeedAggregator: React.FC = () => {
  const [feeds, setFeeds] = useState(feedsConfig);

  const [visibleFeeds, setVisibleFeeds] = useState<{[key: string]: boolean}>(
    feeds.reduce((acc, feed) => {
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

  // Adding a new Feed
  const handleAddFeed = (url: string) => {
    const newFeed = {id: String(feeds.length + 1), url};
    setFeeds(currentFeeds => [...currentFeeds, newFeed]);
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      const parsedFeeds = await Promise.all(
        feeds.map(async feed => {
          const response = await fetch(feed.url);
          const responseData = await response.text();
          const parsed = await rssParser.parse(responseData);
          return {
            ...feed,
            title: parsed.title,
            parsed,
          };
        }),
      );
      setFeedData(parsedFeeds);
    };
    fetchFeeds();
  }, [feeds]);

  return (
    <ScrollView style={styles.scrollView}>
      {feedData.map(feed => (
        <View key={feed.id}>
          <TouchableOpacity
            onPress={() => toggleFeedVisibility(feed.id)}
            style={styles.titleRow}>
            <View style={styles.imgTitle}>
              {feed.parsed.image ? (
                <Image
                  source={{uri: feed.parsed.image.url}}
                  style={styles.favicon}
                />
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
          {visibleFeeds[feed.id] && <Feed feedContent={feed.parsed} />}
        </View>
      ))}
      <AddFeed onAddFeed={handleAddFeed} />
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
    borderRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chevron: {
    width: 16,
    height: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default FeedAggregator;

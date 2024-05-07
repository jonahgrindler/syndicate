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
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors} from '../styles/theme';
import {useFeedData} from '../context/FeedContext';

const FeedAggregator: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [feeds, setFeeds] = useState(feedsConfig);
  const [visibleFeeds, setVisibleFeeds] = useState<{[key: string]: boolean}>(
    feeds.reduce((acc, feed) => {
      acc[feed.id] = false; // Initially all feeds are hidden
      return acc;
    }, {} as {[key: string]: boolean}),
  );
  // const [feedData, setFeedData] = useState<any[]>([]);
  const {feedData, setFeedData} = useFeedData(); // from FeedContext

  // Toggle visibility of a feed
  const toggleFeedVisibility = (id: string) => {
    setVisibleFeeds(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
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
      } catch (error) {
        console.error('Failed to fetch or parse feeds:', error);
      }
    };
    fetchFeeds();
  }, [feeds, setFeedData]);

  return (
    <ScrollView style={styles.scrollView}>
      {feedData.map(feed => (
        <View key={feed.id} style={styles.channel}>
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
            {/* <Chevron /> */}
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
          <>{visibleFeeds[feed.id] && <Feed feedContent={feed.parsed} />}</>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    paddingTop: 16,
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
    color: colors.primary,
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
});

export default FeedAggregator;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Feed from './Feed';
import {
  setupSettingsTable,
  initializeDataIfNeeded,
  getDBConnection,
  createTables,
  getFeeds,
  insertPost,
  fetchPostsForFeed,
} from '../database';
import * as rssParser from 'react-native-rss-parser';
import {colors} from '../styles/theme';
import {useFeedData} from '../context/FeedContext';

const FeedAggregator: React.FC = () => {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [visibleFeeds, setVisibleFeeds] = useState<{[key: string]: boolean}>(
    feeds.reduce((acc, feed) => {
      acc[feed.id] = false; // Initially all feeds are hidden
      return acc;
    }, {} as {[key: string]: boolean}),
  );
  // const [feedData, setFeedData] = useState<any[]>([]);
  const {feedData, setFeedData} = useFeedData(); // from FeedContext

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const db = await getDBConnection();
        console.log('Database connection established');
        await createTables(db);
        console.log('Tables created or already exist');
        await setupSettingsTable(db);
        console.log('Settings table configured');
        await initializeDataIfNeeded(db);
        console.log('Data initialization checked');
        const feedEntries = await getFeeds(db);
        console.log('Feeds loaded:', feedEntries);
        setFeeds(feedEntries);
        const visibility = feedEntries.reduce((acc, feed) => {
          acc[feed.id] = false; // Initially all feeds are hidden
          return acc;
        }, {});
        setVisibleFeeds(visibility);
      } catch (error) {
        console.error('Failed to load feeds:', error);
      }
    };
    loadFeeds();
  }, []);
  // Toggle visibility of a feed
  const toggleFeedVisibility = (id: string) => {
    setVisibleFeeds(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const fetchAndStoreFeeds = async () => {
    const db = await getDBConnection();
    const newFeedData = [];

    for (const feed of feeds) {
      const posts = [];
      try {
        const response = await fetch(feed.channel_url);
        const responseData = await response.text();
        const parsed = await rssParser.parse(responseData);

        for (const item of parsed.items) {
          const uniqueId =
            item.id || item.title || `${feed.channel_url}-${item.title}`;
          const link = item.links[0].url;
          console.log('link: ', link);
          await insertPost(
            db,
            feed.channel_url,
            item.title,
            link,
            item.description,
            item.published,
            uniqueId,
          );
        }
        const fetchedPosts = await fetchPostsForFeed(db, feed.id);
        posts.push(...fetchedPosts);
        newFeedData.push({
          ...feed,
          title: parsed.title || 'No Title Available',
          posts,
        });
      } catch (error) {
        console.error('Failed to fetch or store feeds:', error);
      }
    }
    console.log('new FD:', newFeedData);
    setFeedData(newFeedData); // Update state after all feeds are processed
  };

  useEffect(() => {
    if (feeds.length > 0) {
      fetchAndStoreFeeds();
    }
  }, [feeds]);

  // const fetchFeeds = async () => {
  //   try {
  //     const parsedFeeds = await Promise.all(
  //       feeds.map(async feed => {
  //         console.log('url:', feed.channel_url, feed.id);
  //         const response = await fetch(feed.channel_url);
  //         const responseData = await response.text();
  //         const parsed = await rssParser.parse(responseData);

  //         return {
  //           ...feed,
  //           title: parsed.title,
  //           parsed,
  //         };
  //       }),
  //     );
  //     setFeedData(parsedFeeds);
  //   } catch (error) {
  //     console.error('Failed to fetch or parse feeds:', error);
  //   }
  // };

  // const prevFeedsRef = useRef();
  // useEffect(() => {
  //   if (prevFeedsRef.current !== feeds) {
  //     fetchFeeds();
  //   }
  //   prevFeedsRef.current = feeds;
  // }, [feeds]); // Remove setFeedData if it's not changing or not necessary here

  return (
    <ScrollView style={styles.scrollView}>
      {feedData.map(feed => (
        <View key={feed.id} style={styles.channel}>
          <TouchableOpacity
            onPress={() => toggleFeedVisibility(feed.id)}
            style={styles.titleRow}>
            <View style={styles.imgTitle}>
              {/* {feed.parsed.image ? (
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
              )} */}

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
          <>{visibleFeeds[feed.id] && <Feed feedContent={feed.posts} />}</>
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

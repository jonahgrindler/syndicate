// FeedAggregator.tsx
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing} from '../styles/theme';

import {useFeedData} from '../context/FeedContext';

const AddFeed: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {feedData, setFeedData} = useFeedData();
  const [newFeedUrl, setNewFeedUrl] = useState('');

  // Adding a new Feed
  const handleAddFeed = () => {
    const fetchFeed = async () => {
      if (!newFeedUrl) {
        console.error('No URL provided');
        return;
      }
      try {
        // Fetch the feed data from the provided URL
        const response = await fetch(newFeedUrl);
        const responseData = await response.text();

        // Parse the RSS feed data using your RSS parser
        const parsed = await rssParser.parse(responseData);

        // Create a new feed object
        const newFeed = {
          id: String(feedData.length + 1), // Generate a unique ID for the new feed
          url: newFeedUrl,
          title: parsed.title, // Assuming 'title' is a property of the parsed data
          parsed, // Store the parsed data directly
        };

        // Update your feed list state to include the new feed
        setFeedData(currentFeeds => [...currentFeeds, newFeed]);

        // Optionally, clear the input and provide any navigation or state reset you need
        setNewFeedUrl('');
        navigation.goBack();
      } catch (error) {
        console.error('Failed to fetch or parse feeds:', error);
      }
    };
    fetchFeed();

    // setNewFeedUrl(''); // Reset input after adding
    // navigation.goBack();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeView}>
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Image source={require('../../assets/icons/chevron-left.png')} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setNewFeedUrl}
        value={newFeedUrl}
        placeholder="Enter new feed URL"
        autoCapitalize="none"
      />
      <Button
        title="Add Website"
        onPress={handleAddFeed}
        style={styles.button}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeView: {
    backgroundColor: colors.background,
    flex: 1,
  },
  navigation: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 40,
  },
  input: {
    height: 48,
    borderRadius: 40,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: colors.bgLight,
    fontSize: fonts.size.large,
  },
  button: {
    color: colors.primary,
  },
});

export default AddFeed;

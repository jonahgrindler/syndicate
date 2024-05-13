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
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';

const AddFeed: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {addNewFeed} = useFeed();
  const [newFeedUrl, setNewFeedUrl] = useState('');

  // Adding a new Feed
  const handleAddFeed = () => {
    const fetchFeed = async () => {
      if (!newFeedUrl) {
        console.error('No URL provided');
        return;
      }
      try {
        await addNewFeed(newFeedUrl);
        setNewFeedUrl('');
        navigation.goBack();
      } catch (error) {
        console.error('Failed to fetch or parse feeds:', error);
      }
    };
    fetchFeed();
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
    backgroundColor: colors.dark.background,
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
    backgroundColor: colors.dark.bgLight,
    borderRadius: 40,
  },
  input: {
    height: 48,
    borderRadius: 40,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: colors.dark.bgLight,
    fontSize: fonts.size.large,
  },
  button: {
    color: colors.dark.primary,
  },
});

export default AddFeed;

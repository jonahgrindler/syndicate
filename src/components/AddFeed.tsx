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
  Text,
} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';

const AddFeed: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
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
    <SafeAreaView
      edges={['top']}
      style={[styles.safeView, {backgroundColor: secondaryColor}]}>
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Image
            source={require('../../assets/icons/chevron-left.png')}
            tintColor={primaryColor}
          />
          <Text style={[styles.buttonText, {color: primaryColor}]}>Add</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, {color: primaryColor, borderColor: primaryColor}]}
        onChangeText={setNewFeedUrl}
        value={newFeedUrl}
        placeholder="Enter new feed URL"
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={handleAddFeed}
        style={[styles.button, {color: primaryColor}]}>
        <Text style={[styles.buttonText, {color: primaryColor}]}>Add</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    gap: 4,
  },
  input: {
    height: 48,
    borderRadius: 40,
    margin: 12,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 2,
    // backgroundColor: colors.dark.bgLight,
    fontSize: fonts.size.large,
  },
  buttonText: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  button: {
    color: colors.dark.primary,
  },
});

export default AddFeed;

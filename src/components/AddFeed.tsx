// FeedAggregator.tsx
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import fetchFeedSuggestions from './fetchFeedSuggestions';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const AddFeed: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const {addNewFeed} = useFeed();
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  const fetchSuggestions = async inputUrl => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    setLoading(true);
    try {
      const feeds = await fetchFeedSuggestions(inputUrl, signal);
      setSuggestions(feeds);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching feed suggestions:', error);
        Alert.alert(
          'Error',
          'Failed to fetch feed suggestions. Please try again.',
        );
      }
    }
    setLoading(false);
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    if (newFeedUrl) {
      debouncedFetchSuggestions(newFeedUrl);
    } else {
      setSuggestions([]);
    }
    // if (newFeedUrl) {
    //   const fetchSuggestions = async () => {
    //     setLoading(true);
    //     const feeds = await fetchFeedSuggestions(newFeedUrl);
    //     setSuggestions(feeds);
    //     setLoading(false);
    //   };

    //   fetchSuggestions();
    // } else {
    //   setSuggestions([]);
    // }
  }, [newFeedUrl]);

  // Adding a new Feed
  const handleAddFeed = async feedUrl => {
    const fetchFeed = async () => {
      if (!newFeedUrl) {
        console.error('No URL provided');
        return;
      }
      try {
        await addNewFeed(feedUrl);
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
          <Text style={[styles.buttonText, {color: primaryColor}]}>Back</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, {color: primaryColor, borderColor: primaryColor}]}
        placeholderTextColor={primaryColor}
        onChangeText={setNewFeedUrl}
        value={newFeedUrl}
        placeholder="Website or feed URL"
        autoCapitalize="none"
      />
      {loading && (
        <Text
          style={[
            styles.text,
            styles.loading,
            {color: primaryColor, textAlign: 'center'},
          ]}>
          Loading...
        </Text>
      )}

      <FlatList
        style={styles.suggestionList}
        data={suggestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleAddFeed(item.url)}
            style={styles.suggestion}>
            <View style={styles.iconTitle}>
              {item.icon && (
                <Image source={{uri: item.icon}} style={styles.icon} />
              )}
              <Text style={[styles.text, {color: primaryColor}]}>
                {item.title || item.url}
              </Text>
            </View>
            <View style={[styles.plusIcon, {borderColor: primaryColor}]}>
              <Image
                source={require('../../assets/icons/plus.png')}
                tintColor={primaryColor}
              />
            </View>
          </TouchableOpacity>
        )}
      />
      {/* <TouchableOpacity
        onPress={handleAddFeed}
        style={[
          styles.button,
          {color: primaryColor, borderColor: primaryColor},
        ]}>
        <Text style={[styles.buttonText, {color: primaryColor}]}>Add</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  navigation: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  back: {
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
    marginHorizontal: spacing.leftRightMargin,
    marginVertical: 8,
    marginBottom: 0,
    padding: 10,
    paddingLeft: 20,
    borderWidth: 2,
    // backgroundColor: colors.dark.bgLight,
    fontSize: fonts.size.large,
  },
  loading: {
    marginTop: 12,
  },
  suggestionList: {
    paddingTop: 24,
    marginHorizontal: spacing.leftRightMargin,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  iconTitle: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
    flexShrink: 1,
  },
  plusIcon: {
    borderWidth: 2,
    borderRadius: 40,
    padding: 12,
  },
  buttonText: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  button: {
    color: colors.dark.primary,
    width: 'auto',
    marginHorizontal: spacing.leftRightMargin,
    height: 48,
    borderWidth: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddFeed;

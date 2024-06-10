// FeedAggregator.tsx
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  SectionList,
} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import fetchFeedLinks from './fetchFeedLinks';
import fetchFeedData from './fetchFeedData';
import FeedSuggestionRow from './FeedSuggestionRow';
import DashedLine from 'react-native-dashed-line';
import curatedFeeds from '../data/curatedFeeds';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const AddFeed: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'AddFeed'>>();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const {addNewFeed, feeds} = useFeed();
  const [inputUrl, setInputUrl] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parsedCuratedFeeds, setParsedCuratedFeeds] = useState([]);
  const controllerRef = useRef(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    // controllerRef.current = new AbortController();
    // const signal = controllerRef.current.signal;
    try {
      const signal = new AbortController().signal;
      const fetchedSuggestions = await fetchFeedLinks(inputUrl, signal);
      setSuggestions(fetchedSuggestions);
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

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 10); // may be clearing search results

  useEffect(() => {
    debouncedFetchSuggestions(inputUrl);
  }, [inputUrl]);

  // Curated Feeds
  useEffect(() => {
    const fetchCuratedFeeds = async () => {
      setLoading(true);
      const parsedFeeds = await Promise.all(
        curatedFeeds.map(feed => fetchFeedData(feed)),
      );
      setParsedCuratedFeeds(parsedFeeds.filter(feed => feed !== null));
      setLoading(false);
    };
    fetchCuratedFeeds();
  }, []);

  const renderFeedItem = ({item}) => {
    const isAdded = feeds.some(feed => feed.channel_url === item.url);

    return (
      <FeedSuggestionRow
        url={item.url}
        title={item.custom_title || item.title}
        icon={item.icon}
        isAdded={isAdded}
      />
    );
  };

  const sections = [
    {
      title: 'Search',
      data: suggestions,
    },
    {
      title: 'Suggestions',
      data: parsedCuratedFeeds,
    },
  ];

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
        onChangeText={setInputUrl}
        value={inputUrl}
        placeholder="Website or feed URL"
        autoCapitalize="none"
      />
      <SectionList
        style={styles.suggestionList}
        sections={sections}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({section: {title}}) => (
          <>
            {title === 'Search' ? null : (
              <View style={styles.sectionHeader}>
                <DashedLine
                  dashLength={3}
                  dashThickness={3}
                  dashGap={5}
                  dashColor={primaryColor}
                  dashStyle={{borderRadius: 5, marginBottom: 8}}
                />
                <Text style={[styles.text, {color: primaryColor}]}>
                  {title}
                </Text>
              </View>
            )}
          </>
        )}
        renderItem={renderFeedItem}
        ListFooterComponent={<View style={styles.footerSpace}></View>}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  footerSpace: {
    height: 120,
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
    flexDirection: 'row',
    gap: 4,
    height: 56,
    paddingRight: 40,
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
  sectionHeader: {
    marginTop: 120,
    marginBottom: 48,
  },
  suggestionList: {
    paddingTop: 24,
    paddingHorizontal: spacing.leftRightMargin,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  iconTitle: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 40,
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
    flexShrink: 1,
    paddingRight: 48,
  },
  textSmall: {
    flex: 0,
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: 48,
  },
  plusIcon: {
    borderWidth: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
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

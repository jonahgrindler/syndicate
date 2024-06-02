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
  ActivityIndicator,
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

const CuratedSuggestions: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'AddFeed'>>();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const {addNewFeed, feeds} = useFeed();
  const [loading, setLoading] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const [parsedCuratedFeeds, setParsedCuratedFeeds] = useState([]);

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

  return (
    <>
      <View style={styles.container}>
        <DashedLine
          dashLength={3}
          dashThickness={3}
          dashGap={5}
          dashColor={primaryColor}
          dashStyle={{borderRadius: 5, marginBottom: 8}}
        />
        <Text style={[styles.text, {color: primaryColor}]}>Suggestions</Text>
      </View>
      <FlatList
        style={styles.suggestionList}
        keyboardShouldPersistTaps="always"
        data={parsedCuratedFeeds}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFeedItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.leftRightMargin,
    marginTop: 120,
  },
  safeView: {
    flex: 1,
  },
  loading: {
    marginTop: 12,
  },
  suggestionList: {
    paddingTop: 24,
    marginHorizontal: spacing.leftRightMargin,
    // gap: 40,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 40,
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

export default CuratedSuggestions;

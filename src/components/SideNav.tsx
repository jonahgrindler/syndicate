import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Feed from './Feed';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import HomeRow from './HomeRow';
import ResetDatabase from './ResetDatabase';
import ThemePicker from './ThemePicker';
import {useTheme} from '../styles/theme';
import ChannelMenu from './ChannelMenu';
import NavRow from './NavRow';
import NavButton from './NavButton';

const SideNav: React.FC = ({feedContent}) => {
  const {
    feedData,
    visibleFeeds,
    toggleFeedVisibility,
    refreshFeeds,
    handleOpenFeed,
    allPosts,
    savedPosts,
    handleDelete,
    loading,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeeds();
    setRefreshing(false);
  };

  return (
    <View style={[styles.safeAreaView, {backgroundColor: secondaryColor}]}>
      <ScrollView
        style={[{paddingTop: insets.top + 4, paddingLeft: insets.left}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
          />
        }>
        <NavRow
          title={'Everything'}
          selected={true}
          newCount={0}
          feedId={'everything'}
        />
        <NavRow
          title={'Saved'}
          selected={false}
          newCount={0}
          feedId={'saved'}
        />

        {feedData.map(feed => (
          <View key={feed.id} style={styles.channel}>
            <NavRow
              title={feed.custom_title ? feed.custom_title : feed.title}
              selected={false}
              newCount={feed.unseenCount}
              feedId={feed.id}
            />
          </View>
        ))}

        <NavRow
          title={'Settings'}
          selected={false}
          newCount={0}
          feedId={'settings'}
        />
      </ScrollView>
      <View style={[styles.buttons, {paddingBottom: insets.bottom}]}>
        <NavButton label={'Add'} buttonHeight={106} to={'AddFeed'} />
        <NavButton label={'Folder'} buttonHeight={36} to={'AddFeed'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 6,
    maxWidth: 142,
    justifyContent: 'space-between',
  },
  buttons: {
    gap: 8,
  },
});

export default SideNav;

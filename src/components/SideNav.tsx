import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
    handleOpenFeed,
    allPosts,
    savedPosts,
    handleDelete,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeAreaView, {backgroundColor: secondaryColor}]}>
      <View>
        <NavRow
          title={'Everything'}
          selected={true}
          newCount={1}
          feedId={'everything'}
        />
        <NavRow
          title={'Saved'}
          selected={false}
          newCount={0}
          feedId={'saved'}
        />
        <NavRow
          title={'My Posts'}
          selected={false}
          newCount={0}
          feedId={'myPosts'}
        />

        {feedData.map(feed => (
          <View key={feed.id} style={styles.channel}>
            <NavRow
              title={feed.title}
              selected={false}
              newCount={0}
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
      </View>
      <View style={styles.buttons}>
        <NavButton label={'Post'} buttonHeight={106} to={''} />
        <NavButton label={'Add'} buttonHeight={36} to={'AddFeed'} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 8,
    paddingLeft: 6,
    maxWidth: 140,
    justifyContent: 'space-between',
  },
  buttons: {
    gap: 8,
  },
});

export default SideNav;

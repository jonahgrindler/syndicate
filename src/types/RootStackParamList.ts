import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  FeedAggregator: undefined;
  HomeScreen: undefined;
  Feed: undefined;
  AddFeed: {AddFeedProps: undefined};
  ChannelAllPosts: {feedContent: undefined};
  FeedWebView: {url: string};
  SavedScreen: undefined;
  SettingsScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Saved
export type SavedParamList = {
  Latest: undefined;
};

export type SavedScreenProps<T extends keyof SavedParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<SavedParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Settings
export type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SettingsScreen'
>;

// Global
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

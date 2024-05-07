import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FeedAggregator from './src/components/FeedAggregator';
import HomeTopNav from './src/components/HomeTopNav';
import {colors} from './src/styles/theme';

function Home() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.home}>
      <HomeTopNav />
      <FeedAggregator />
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
});

export default Home;

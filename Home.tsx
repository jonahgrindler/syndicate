import React from 'react';
import {View, StyleSheet} from 'react-native';
import FeedAggregator from './src/components/FeedAggregator';
import HomeTopNav from './src/components/HomeTopNav';
import ResetDatabase from './src/components/ResetDatabase';

function Home() {
  return (
    <View style={styles.home}>
      <HomeTopNav />
      <ResetDatabase />
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

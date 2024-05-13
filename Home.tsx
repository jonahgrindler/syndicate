import React from 'react';
import {View, StyleSheet} from 'react-native';
import FeedAggregator from './src/components/FeedAggregator';
import HomeTopNav from './src/components/HomeTopNav';
import FloatingActionButton from './src/components/FloatingActionButton';

function Home() {
  return (
    <View style={styles.home}>
      <FeedAggregator />
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
});

export default Home;

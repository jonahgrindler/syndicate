import React from 'react';
import {View, StyleSheet} from 'react-native';
import SideNav from './src/components/SideNav';
import SideFeed from './src/components/SideFeed';
import {colors, useTheme} from './src/styles/theme';
import {useFeed} from './src/context/FeedContext';
import Settings from './src/components/Settings';

function SplitHome() {
  const {showSettings} = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  return (
    <View style={[styles.home, {backgroundColor: secondaryColor}]}>
      <SideNav />
      {showSettings ? <Settings /> : <SideFeed />}
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.secondary,
  },
});

export default SplitHome;

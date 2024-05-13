import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles/theme';

const HomeRow: React.FC = ({image, title}) => {
  return (
    <TouchableOpacity
      // onPress={() => toggleFeedVisibility(feed.id)}
      style={styles.titleRow}>
      <View style={styles.imgTitle}>
        <Image source={image} style={styles.favicon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image
        source={require('../../assets/icons/chevron.png')}
        style={[styles.chevron]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginLeft: 16,
    marginRight: 16,
  },
  imgTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favicon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.primary,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  channel: {
    flexGrow: 1,
    flexShrink: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default HomeRow;

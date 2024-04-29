import React from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import {FeedContent} from '../types/feedTypes';

interface FeedProps {
  feedContent: FeedContent;
}

const Feed: React.FC<FeedProps> = ({feedContent}) => {
  return (
    <FlatList
      data={feedContent.items}
      horizontal={true}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/placeholder.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.published}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
    marginBottom: 8,
    maxWidth: 288,
    marginRight: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  image: {
    width: 288,
    maxHeight: 331,
    marginBottom: 8,
  },
});

export default Feed;

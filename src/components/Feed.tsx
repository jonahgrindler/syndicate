import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {FeedProps, FeedItem} from '../types/FeedTypes';
import {RootStackParamList} from '../types/RootStackParamList';
import CarouselActions from './CarouselActions';

const Feed: React.FC<FeedProps> = ({feedContent}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Feed'>>();

  const handlePress = (item: FeedItem) => {
    // Assuming 'links' is an array and we want the first link
    const firstUrl =
      item.links && item.links.length > 0 ? item.links[0].url : null;
    if (firstUrl) {
      navigation.navigate('FeedWebView', {url: firstUrl});
    }
  };

  return (
    <>
      <FlatList
        data={feedContent.items}
        horizontal={true}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.container}>
            <Image
              source={require('../../assets/images/placeholder.jpg')}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.published}</Text>
          </TouchableOpacity>
        )}
      />
      <CarouselActions />
    </>
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

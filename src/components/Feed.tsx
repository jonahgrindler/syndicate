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
import {colors, fonts, images, spacing} from '../styles/theme';

const Feed: React.FC<FeedProps> = ({feedContent}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Feed'>>();

  const handlePress = (item: FeedItem) => {
    navigation.navigate('FeedWebView', {url: item.link});
  };

  return (
    <>
      <FlatList
        horizontal={true}
        style={styles.flatList}
        data={feedContent}
        keyExtractor={item => item.post_id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.postContainer}>
            <Image
              source={require('../../assets/images/placeholder.jpg')}
              style={styles.postImage}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtext}>{item.published}</Text>
          </TouchableOpacity>
        )}
      />
      <CarouselActions feedContent={feedContent} />
    </>
  );
};

const styles = StyleSheet.create({
  flatList: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingBottom: spacing.row,
    height: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  postContainer: {
    width: images.size.small.width,
    marginRight: 12,
    height: 'auto',
  },
  postImage: {
    width: images.size.small.width,
    height: images.size.small.height,
    marginBottom: 8,
    borderRadius: images.radius.small,
  },
  title: {
    fontWeight: 'bold',
    fontSize: fonts.size.medium,
    color: colors.primary,
  },
  subtext: {
    fontSize: fonts.size.small,
    color: colors.secondaryText,
    marginTop: 4,
  },
});

export default Feed;

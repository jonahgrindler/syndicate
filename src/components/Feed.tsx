import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import {FeedProps, FeedItem} from '../types/FeedTypes';
import {RootStackParamList} from '../types/RootStackParamList';
import CarouselActions from './CarouselActions';
import {colors, fonts, images, spacing} from '../styles/theme';
import formatDate from '../utilities/formatDate';
import {useTheme} from '../styles/theme';

const Feed: React.FC<FeedProps> = ({feedContent}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Feed'>>();
  const {primaryColor, secondaryColor} = useTheme();
  const [largeImages, setLargeImages] = useState(true);

  const handleNavigation = (item: FeedItem) => {
    console.log('item:', item);
    navigation.navigate('FeedWebView', {
      url: item.link,
      postId: item.post_unique_id,
    });
  };

  const handleLargeImages = () => {
    setLargeImages(prevSize => !prevSize);
  };

  return (
    <>
      <FlatList
        horizontal={true}
        style={styles.flatList}
        data={feedContent}
        keyExtractor={item => item.post_unique_id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleNavigation(item)}
            style={[
              styles.postContainer,
              largeImages ? styles.smallPost : styles.largePost,
            ]}>
            {item.imageUrl ? (
              <Image
                source={{uri: item.imageUrl}}
                style={[
                  styles.postImage,
                  largeImages ? styles.smallImage : styles.largeImage,
                ]}
              />
            ) : (
              <Image
                source={require('../../assets/images/placeholder.jpg')}
                style={[
                  styles.postImage,
                  largeImages ? styles.smallImage : styles.largeImage,
                  {tintColor: primaryColor},
                ]}
              />
            )}

            <Text style={[styles.title, {color: primaryColor}]}>
              {item.title}
            </Text>
            <Text style={[styles.subtext, {color: primaryColor}]}>
              {formatDate(item.published)}
            </Text>
          </TouchableOpacity>
        )}
      />
      <CarouselActions
        feedContent={feedContent}
        handleLargeImages={handleLargeImages}
        largeImages={largeImages}
      />
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
    marginRight: 12,
    height: 'auto',
  },
  smallPost: {
    width: images.size.small.width,
    height: 'auto',
  },
  largePost: {
    width: images.size.large.width,
    height: 'auto',
  },
  postImage: {
    marginBottom: 8,
    borderRadius: images.radius.small,
  },
  smallImage: {
    width: images.size.small.width,
    height: images.size.small.height,
  },
  largeImage: {
    width: images.size.large.width,
    height: images.size.large.height,
  },
  title: {
    fontWeight: 'bold',
    fontSize: fonts.size.medium,
    color: colors.dark.primary,
  },
  subtext: {
    fontSize: fonts.size.small,
    color: colors.dark.secondaryText,
    opacity: 0.6,
    marginTop: 4,
  },
});

export default Feed;

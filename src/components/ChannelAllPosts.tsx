import React from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFeedData} from '../context/FeedContext';
import {colors, fonts, images, spacing} from '../styles/theme';

const ChannelAllPosts = ({route}) => {
  const {feedContent} = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {feedData} = useFeedData();

  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.center}>
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.back}>
            <Image source={require('../../assets/icons/chevron-left.png')} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Channel</Text>
          <TouchableOpacity onPress={() => {}} style={styles.back}>
            <Image source={require('../../assets/icons/more.png')} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal={false}
          columnWrapperStyle={styles.columnWrapperStyle}
          numColumns={2}
          style={styles.flatList}
          data={feedContent.items}
          keyExtractor={item => item.id}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  navigation: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 40,
  },
  navTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
  },
  flatList: {
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  columnWrapperStyle: {
    marginBottom: spacing.row,
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  postContainer: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    flex: 1,
  },
  postImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: images.radius.small,
    marginBottom: 8,
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

export default ChannelAllPosts;

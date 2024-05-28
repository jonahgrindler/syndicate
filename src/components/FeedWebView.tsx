import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';

type WebViewProps = {
  route: RouteProp<RootStackParamList, 'FeedWebView'>;
};

const FeedWebView: React.FC<WebViewProps> = ({route}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {handleSavePost, handleUnsavePost, savedPosts} = useFeed();
  const {url, postId} = route.params;
  // console.log('postId', postId);
  // console.log(savedPosts);
  const isSaved = savedPosts.some(
    savedPost => savedPost.post_unique_id === postId,
  );
  console.log(isSaved);

  return (
    <SafeAreaView style={styles.webView}>
      <WebView useWebKit={true} source={{uri: url}} style={styles.webView} />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/chevron-left.png')}
            tintColor={colors.primary}
          />
        </TouchableOpacity>
        {isSaved ? (
          <TouchableOpacity onPress={() => handleUnsavePost(postId)}>
            <Image
              source={require('../../assets/icons/save-fill.png')}
              tintColor={colors.primary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleSavePost(postId)}>
            <Image
              source={require('../../assets/icons/save.png')}
              tintColor={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1, // Ensures that the WebView takes up the full space of its container
    backgroundColor: colors.secondary,
  },
  bottomBar: {
    height: 56,
    width: '100%',
    backgroundColor: colors.secondary,
    bottom: 0,
    flexDirection: 'row',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
    paddingTop: spacing.leftRightMargin,

    justifyContent: 'space-between',
  },
});

export default FeedWebView;

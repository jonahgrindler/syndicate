import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  useNavigation,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type WebViewProps = {
  route: RouteProp<RootStackParamList, 'FeedWebView'>;
};
type WebViewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FeedWebView'
>;

const FeedWebView: React.FC<WebViewProps> = ({route}) => {
  const {url} = route.params;
  // const navigation = useNavigation<WebViewNavigationProp>();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'FeedWebView'>>();

  return (
    <SafeAreaView style={styles.webView}>
      <WebView useWebKit={true} source={{uri: url}} style={styles.webView} />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('FeedAggregator')}>
          <Image source={require('../../assets/icons/chevron-left.png')} />
        </TouchableOpacity>
        <Image source={require('../../assets/icons/save.png')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1, // Ensures that the WebView takes up the full space of its container
  },
  bottomBar: {
    height: 72,
    width: '100%',
    backgroundColor: 'white',
    bottom: 0,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 20,

    justifyContent: 'space-between',
  },
});

export default FeedWebView;

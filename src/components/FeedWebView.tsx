import React from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

interface WebViewProps {
  url: string;
}

const FeedWebView = ({url}) => {
  return <WebView source={{uri: url}} style={styles.webView} />;
};

const styles = StyleSheet.create({
  webView: {
    flex: 1, // Ensures that the WebView takes up the full space of its container
  },
});

export default FeedWebView;

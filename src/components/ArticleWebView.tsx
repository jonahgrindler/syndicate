import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import WebView from 'react-native-webview';

interface ArticleWebViewProps {
  url: string;
}

const ArticleWebView: React.FC<ArticleWebViewProps> = ({url}) => {
  return (
    <SafeAreaView style={styles.flexContainer}>
      <WebView source={{uri: url}} style={styles.flexContainer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default ArticleWebView;

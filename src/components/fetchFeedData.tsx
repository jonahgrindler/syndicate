import * as rssParser from 'react-native-rss-parser';

const fetchFeedData = async feed => {
  const {channel_url, custom_title} = feed;
  try {
    const response = await fetch(channel_url);
    const responseData = await response.text();
    const parsed = await rssParser.parse(responseData);
    return {
      url: channel_url,
      title: custom_title || parsed.title,
      icon: parsed.image?.url || null,
    };
  } catch (error) {
    console.error(`Failed to fetch or parse feed at ${channel_url}:`, error);
    return null;
  }
};

export default fetchFeedData;

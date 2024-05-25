import * as rssParser from 'react-native-rss-parser';

const ensureHttps = url => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const fetchFeedSuggestions = async (inputUrl, signal) => {
  let url = inputUrl;

  // Ensure the URL has the correct protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const tryFetch = async urlToTry => {
    try {
      const response = await fetch(urlToTry, {signal});
      const html = await response.text();

      // Use regex or a DOM parser to find RSS/Atom links if not a direct feed
      const rssLinks = [];
      const linkRegex =
        /<link[^>]+rel="alternate"[^>]+type="application\/(rss\+xml|atom\+xml)"[^>]*>/gi;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const hrefMatch = /href="([^"]+)"/.exec(match[0]);
        if (hrefMatch) {
          // Resolve relative URLs
          const feedUrl = ensureHttps(new URL(hrefMatch[1], urlToTry).href);
          rssLinks.push(feedUrl);
        }
      }

      // return rssLinks;

      // Fetch feed info for each RSS link
      const feeds = await Promise.all(
        rssLinks.map(async link => {
          try {
            const feedResponse = await fetch(link);
            const feedText = await feedResponse.text();
            const feed = await rssParser.parse(feedText);
            return {url: link, title: feed.title, icon: feed.image?.url};
          } catch (error) {
            console.error(`Failed to parse feed at ${link}:`, error);
            return null;
          }
        }),
      );
      return feeds.filter(feed => feed !== null);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Fetch aborted for ${urlToTry}`);
      } else {
        console.warn(
          `Failed to fetch feed suggestions for ${urlToTry}:`,
          error,
        );
      }
      return [];
    }
  };

  let suggestions = await tryFetch(url);

  // If no suggestions and the URL doesn't already have a TLD, try adding .com
  if (suggestions.length === 0 && !/\.[a-z]{2,}$/.test(url)) {
    url = url.replace(/^https?:\/\//i, ''); // Remove protocol for better handling
    url = `https://${url}.com`;
    suggestions = await tryFetch(url);
  }

  return suggestions;
};

export default fetchFeedSuggestions;

import * as rssParser from 'react-native-rss-parser';
import {parseDocument} from 'htmlparser2';
import {DomUtils} from 'domhandler';

const ensureHttps = url => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const removeTrailingSlash = url => {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
};

const fetchFeedSuggestions = async (inputUrl, signal) => {
  let url = inputUrl;

  // Ensure the URL has the correct protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const tryFetchFeed = async urlToTry => {
    try {
      const response = await fetch(urlToTry, {signal});
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const feedText = await response.text();
      const feed = await rssParser.parse(feedText);
      console.log('feed', feed);
      return [{url: urlToTry, title: feed.title, icon: feed.image?.url}];
    } catch (error) {
      console.warn(`Failed to parse feed at ${urlToTry}:`, error);
      return null;
    }
  };

  const tryFetchHtml = async urlToTry => {
    try {
      const response = await fetch(urlToTry, {signal});
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const html = await response.text();
      const doc = parseDocument(html);

      // Use htmlparser2 to find RSS/Atom links if not a direct feed
      const rssLinks = [];

      const extractLinks = (element, baseUrl) => {
        if (
          element.name === 'link' &&
          element.attribs.rel === 'alternate' &&
          (element.attribs.type === 'application/rss+xml' ||
            element.attribs.type === 'application/atom+xml')
        ) {
          const href = element.attribs.href;
          if (href) {
            const feedUrl = ensureHttps(new URL(href, baseUrl).href);
            rssLinks.push(removeTrailingSlash(feedUrl));
          }
        }
        if (
          element.name === 'a' &&
          element.attribs.href &&
          element.attribs.href.endsWith('.xml')
        ) {
          const href = element.attribs.href;
          if (href) {
            const feedUrl = ensureHttps(new URL(href, baseUrl).href);
            rssLinks.push(removeTrailingSlash(feedUrl));
          }
        }
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => extractLinks(child, baseUrl));
        }
      };

      // Start traversing the parsed document
      doc.children.forEach(element => extractLinks(element, urlToTry));
      // const linkRegex =
      //   /<link[^>]+rel="alternate"[^>]+type="application\/(rss\+xml|atom\+xml)"[^>]*>/gi;
      // const aTagRegex = /<a[^>]+href="([^"]+\.xml)"[^>]*>.*<\/a>/gi;

      // let match;
      // console.log('Scanning for <link> elements...');
      // while ((match = linkRegex.exec(html)) !== null) {
      //   const hrefMatch = /href="([^"]+)"/.exec(match[0]);
      //   if (hrefMatch) {
      //     // Resolve relative URLs
      //     const feedUrl = ensureHttps(new URL(hrefMatch[1], urlToTry).href);
      //     rssLinks.push(removeTrailingSlash(feedUrl));
      //     console.log('Found link:', feedUrl);
      //   }
      // }

      // console.log('Scanning for <a> elements...');
      // while ((match = aTagRegex.exec(html)) !== null) {
      //   const hrefMatch = /href="([^"]+\.xml)"/.exec(match[0]);
      //   if (hrefMatch) {
      //     // Resolve relative URLs
      //     const feedUrl = ensureHttps(new URL(hrefMatch[1], urlToTry).href);
      //     rssLinks.push(removeTrailingSlash(feedUrl));
      //     console.log('Found link:', feedUrl);
      //   }
      // }

      // Fetch feed info for each RSS link
      console.log('rss links', rssLinks);
      const feeds = await Promise.all(
        rssLinks.map(async link => {
          try {
            console.log('link', link);
            const feedResponse = await fetch(link, {signal});
            console.log('feedResponse status', feedResponse.status);
            if (!feedResponse.ok) {
              throw new Error(
                `Network response was not ok: ${feedResponse.statusText}`,
              );
            }
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

  // Try fetching as a direct feed
  let suggestions = await tryFetchFeed(url);

  if (!suggestions || suggestions.length === 0) {
    // If direct feed fetch fails, try fetching as HTML
    suggestions = await tryFetchHtml(url);
  }

  // If no suggestions and the URL doesn't already have a TLD, try adding .com
  if (suggestions.length === 0 && !/\.[a-z]{2,}$/.test(url)) {
    url = url.replace(/^https?:\/\//i, ''); // Remove protocol for better handling
    url = `https://${url}.com`;
    suggestions = await tryFetchHtml(url);
  }

  return suggestions;
};

export default fetchFeedSuggestions;

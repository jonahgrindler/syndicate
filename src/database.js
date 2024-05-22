import SQLite from 'react-native-sqlite-storage';
import * as rssParser from 'react-native-rss-parser';

SQLite.enablePromise(true);

const feedsDB = 'FeedsDB.db';
const databaseVersion = '1.0';
const databaseDisplayName = 'SQLite Feeds Database';
const databaseSize = 200000; // ~200MB

export const getDBConnection = async () => {
  try {
    return SQLite.openDatabase({
      name: feedsDB,
      location: 'default',
    });
  } catch (e) {
    console.error('Failed to open database:', e);
    throw e;
  }
};

export const createTables = async db => {
  // SQL statement to create a feeds table
  const queryFeeds = `
    CREATE TABLE IF NOT EXISTS feeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_url TEXT UNIQUE,
      title TEXT,
      image TEXT,
      image_size BOOLEAN DEFAULT 0,
      unseen_count INTEGER DEFAULT 0
    );
  `;
  const queryPosts = `
    CREATE TABLE IF NOT EXISTS posts (
      post_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      channel_id INTEGER, 
      title TEXT,
      link TEXT,
      description TEXT, 
      published DATE, 
      imageUrl TEXT, 
      post_unique_id TEXT UNIQUE,
      is_saved BOOLEAN DEFAULT 0,
      is_viewed BOOLEAN DEFAULT 0,
      FOREIGN KEY (channel_id) REFERENCES Channels (channel_id)
    );
  `;

  await db.executeSql(queryFeeds);
  await db.executeSql(queryPosts);
};

// Setup default feeds
export const setupDefaultFeeds = async (db, userId) => {
  // Your test data insertion logic
  console.log('Inserting initial test data');
  const defaultFeeds = [
    {
      channel_url: 'https://feeds2.feedburner.com/itsnicethat/SlXC',
      title: 'Its Nice That',
    },
    {
      channel_url: 'https://anothergraphic.org/feed/',
      title: 'Another Graphic',
    },
    {
      channel_url: 'https://thecreativeindependent.com/feed.xml',
      title: 'The Creative Independent',
    },
    {
      channel_url: 'https://www.hoverstat.es/rss.xml',
      title: 'hoverstat.es',
    },
    {
      channel_url: 'https://sidebar.io/feed.xml',
      title: 'Sidebar',
    },
    {
      channel_url: 'https://feeds.feedburner.com/pudding/feed',
      title: 'The Pudding',
    },
  ];
  const insertFeedSql = `INSERT INTO feeds (channel_url, title) VALUES (?, ?);`;

  for (let feed of defaultFeeds) {
    await insertFeed(db, {channel_url: feed.channel_url});
  }
};

export const setupSettingsTable = async db => {
  await db.executeSql(`
      CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
      );
  `);

  // Check if initialized
  const result = await db.executeSql(
    `SELECT value FROM settings WHERE key = 'initialized';`,
  );
  if (result[0].rows.length === 0) {
    // Assume app is not initialized
    await db.executeSql(`INSERT INTO settings (key, value) VALUES (?, ?);`, [
      'initialized',
      'false',
    ]);
  }
};

export const initializeDataIfNeeded = async db => {
  const checkInit = await db.executeSql(
    `SELECT value FROM settings WHERE key = 'initialized';`,
  );
  if (checkInit[0].rows.item(0).value === 'false') {
    // Insert default or test data
    await setupDefaultFeeds(db);
    // Update the initialized flag
    await db.executeSql(`UPDATE settings SET value = ? WHERE key = ?;`, [
      'true',
      'initialized',
    ]);
  }
};

export const initializeDatabase = async db => {
  // const db = await getDBConnection();
  console.log(db);
  await createTables(db);
  await setupSettingsTable(db);
  await initializeDataIfNeeded(db);
};

export const parseFeed = async url => {
  try {
    const response = await fetch(url);
    const responseData = await response.text();
    const parsed = await rssParser.parse(responseData);

    // Transform the parsed data to include imageUrl directly in each item if available
    const itemsWithImages = parsed.items.map(item => {
      let imageUrl = '';
      if (
        item.enclosures &&
        item.enclosures.some(enc => enc.type.startsWith('image'))
      ) {
        imageUrl = item.enclosures.find(enc =>
          enc.type.startsWith('image'),
        ).url;
      } else if (item.content) {
        // Optionally extract from content
        const regex = /<img.*?src=['"](.*?)['"]/i;
        const match = regex.exec(item.content);
        if (match) {
          imageUrl = match[1];
        }
      }
      return {...item, imageUrl};
    });

    return {
      ...parsed,
      items: itemsWithImages,
    };
  } catch (error) {
    console.error('Failed to fetch or parse feed:', error);
    throw error;
  }
};

export const insertFeed = async (db, feed) => {
  const {channel_url} = feed;
  console.log('url', channel_url);
  const parsed = await parseFeed(channel_url);
  // console.log(parsed.image.url);

  try {
    const insertQuery = `
      INSERT OR IGNORE INTO feeds (channel_url, title, image) VALUES (?, ?, ?);
  `;
    await db.executeSql(insertQuery, [
      channel_url,
      parsed.title,
      parsed.image.url,
    ]);
    console.log(
      'Feed added successfully:',
      channel_url,
      'image:',
      parsed.image.url,
    );
  } catch (error) {
    console.error('Failed to add feed:', error);
    throw error;
  }
};

export const insertPost = async (
  db,
  channelUrl,
  title,
  link,
  description,
  published,
  imageUrl,
  uniqueId,
  feedId,
) => {
  try {
    // First, get the channel ID from the feeds table based on the channel URL
    const channelResults = await db.executeSql(
      'SELECT id FROM feeds WHERE channel_url = ?',
      [channelUrl],
    );
    if (channelResults[0].rows.length > 0) {
      const channel_id = channelResults[0].rows.item(0).id;

      // Insert the post data into the posts table
      const insertQuery = `
        INSERT OR IGNORE INTO posts (
          channel_id, 
          title, 
          link, 
          description, 
          published, 
          imageUrl, 
          post_unique_id,
          is_viewed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0);
      `;
      await db.executeSql(insertQuery, [
        channel_id,
        title,
        link,
        description,
        published,
        imageUrl,
        uniqueId,
      ]);
      const updateFeedQuery =
        'UPDATE feeds SET unseen_count = unseen_count + 1 WHERE id = ?';
      await db.executeSql(updateFeedQuery, [feedId]);
    } else {
      console.error('No channel found with URL:', channelUrl);
    }
  } catch (error) {
    console.error('Failed to add post or update unseen count:', error);
    throw error;
  }
};

export const insertPosts = async (db, channelUrl, posts) => {
  for (const post of posts) {
    await insertPost(
      db,
      channelUrl,
      post.title,
      post.link,
      post.description,
      post.published,
      post.imageUrl,
      post.uniqueId,
      post.isViewed,
    );
    // console.log(post);
  }
};

// Function to mark a post as saved
export const savePost = async (db, postId) => {
  await db.executeSql(
    'UPDATE posts SET is_saved = 1 WHERE post_unique_id = ?',
    [postId],
  );
};

// Function to unmark a post as saved
export const unsavePost = async (db, postId) => {
  await db.executeSql(
    'UPDATE posts SET is_saved = 0 WHERE post_unique_id = ?',
    [postId],
  );
};

// Function to fetch saved posts
export const getSavedPosts = async db => {
  const results = await db.executeSql('SELECT * FROM posts WHERE is_saved = 1');
  let posts = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    posts.push(results[0].rows.item(i));
  }
  return posts;
};

export const countNewPosts = async (db, feedId) => {
  const results = await db.executeSql(
    'SELECT COUNT(*) AS newPostsCount FROM posts WHERE channel_id = ? AND is_viewed = 0',
    [feedId],
  );
  return results[0].rows.item(0).newPostsCount;
};

export const viewFeed = async (db, feedId) => {
  try {
    await db.executeSql('UPDATE posts SET is_viewed = 1 WHERE channel_id = ?', [
      feedId,
    ]);
    await db.executeSql('UPDATE feeds SET unseen_count = 0 WHERE id = ?', [
      feedId,
    ]);
  } catch (error) {
    console.error(
      'Failed to mark posts as viewed or reset unseen count:',
      error,
    );
  }
};

export const fetchPostsForFeed = async (db, feedId) => {
  try {
    const results = await db.executeSql(
      'SELECT * FROM posts WHERE channel_id = ?',
      [feedId],
    );
    let posts = [];
    for (let i = 0; i < results[0].rows.length; i++) {
      posts.push(results[0].rows.item(i));
    }
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts for feed:', error);
    throw error; // or return an empty array depending on your error handling strategy
  }
};

export const getFeeds = async db => {
  try {
    const feeds = [];
    const results = await db.executeSql(`SELECT id, channel_url FROM feeds;`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        feeds.push(result.rows.item(index));
      }
    });
    return feeds;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get feeds from database');
  }
};

export const deleteFeed = async (db, feedId) => {
  try {
    await db.executeSql('DELETE FROM feeds WHERE id = ?', [feedId]);
    console.log('Feed deleted successfully');
  } catch (error) {
    console.error('Failed to delete feed:', error);
  }
};

// Dev Helpers
export const deleteDatabase = async () => {
  const path = 'FeedsDB.db'; // The name of your database file
  return SQLite.deleteDatabase({name: path, location: 'default'});
};

export const resetDatabaseTables = async db => {
  try {
    // Drop tables
    await db.executeSql('DROP TABLE IF EXISTS posts;');
    await db.executeSql('DROP TABLE IF EXISTS feeds;');
    await db.executeSql('DROP TABLE IF EXISTS settings;');

    // Recreate tables
    await createTables(db); // Assuming this function creates all necessary tables
    await setupSettingsTable(db);
    console.log('Database has been reset and tables recreated.');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

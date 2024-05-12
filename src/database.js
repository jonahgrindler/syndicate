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
      channel_url TEXT,
      title TEXT
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
      post_unique_id TEXT UNIQUE,
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
  ];
  const insertFeedSql = `INSERT INTO feeds (channel_url, title) VALUES (?, ?);`;
  for (let feed of defaultFeeds) {
    await db.executeSql(insertFeedSql, [feed.channel_url]);
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
    const data = await response.text();
    return rssParser.parse(data);
  } catch (error) {
    console.error('Failed to fetch or parse feed:', error);
    throw error;
  }
};

export const insertFeed = async (db, feed) => {
  const {url} = feed;
  try {
    const insertQuery = `
      INSERT INTO feeds (channel_url, title) VALUES (?, ?);
  `;
    await db.executeSql(insertQuery, [url]);
    console.log('Feed added successfully:', url);
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
  uniqueId,
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
          post_unique_id
        ) VALUES (?, ?, ?, ?, ?, ?);
      `;
      const insertResults = await db.executeSql(insertQuery, [
        channel_id,
        title,
        link,
        description,
        published,
        uniqueId,
      ]);
      console.log(
        `Inserted ${insertResults[0].rowsAffected} post(s) with unique ID: ${uniqueId} for channel: ${channel_id}`,
      );
    } else {
      console.error('No channel found with URL:', channelUrl);
    }
  } catch (error) {
    console.error('Failed to add post:', error);
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
      post.uniqueId,
    );
    console.log(post);
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

export const deleteFeed = async (db, id) => {
  const deleteQuery = `DELETE FROM feeds WHERE id = ?;`;
  await db.executeSql(deleteQuery, [id]);
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

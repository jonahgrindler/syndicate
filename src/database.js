import SQLite from 'react-native-sqlite-storage';
import * as rssParser from 'react-native-rss-parser';

SQLite.enablePromise(true);

const feedsDB = 'FeedsDB.db';
const databaseVersion = '1.1';
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
      custom_title TEXT,
      image TEXT,
      image_size BOOLEAN DEFAULT 0,
      unseen_count INTEGER DEFAULT 0,
      show_in_everything INTEGER DEFAULT 1
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
  const queryFolders = `
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );
  `;
  const queryFeedFolders = `
    CREATE TABLE IF NOT EXISTS feed_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER,
      feed_id INTEGER,
      FOREIGN KEY (folder_id) REFERENCES folders (id),
      FOREIGN KEY (feed_id) REFERENCES feeds (id)
    );
  `;
  const queryMigrationsTable = `
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL
    );
  `;

  await db.executeSql(queryFeeds);
  await db.executeSql(queryPosts);
  await db.executeSql(queryFolders);
  await db.executeSql(queryFeedFolders);
  await db.executeSql(queryMigrationsTable);
};

// Setup default feeds
export const setupDefaultFeeds = async (db, userId) => {
  // Your test data insertion logic
  console.log('Inserting initial test data');
  const defaultFeeds = [
    {
      channel_url: 'https://feeds2.feedburner.com/itsnicethat/SlXC',
      custom_title: 'Its Nice That',
    },
    {
      channel_url: 'https://anothergraphic.org/feed/',
      custom_title: 'Another Graphic',
    },
    {
      channel_url: 'https://thecreativeindependent.com/feed.xml',
      custom_title: 'The Creative Independent',
    },
    {
      channel_url: 'https://www.hoverstat.es/rss.xml',
      custom_title: 'hoverstat.es',
    },
    {
      channel_url: 'https://feeds.feedburner.com/pudding/feed',
      custom_title: 'The Pudding',
    },
    {
      channel_url: 'https://pitchfork.com/feed/feed-news/rss',
      custom_title: 'Pitchfork',
    },
  ];
  const insertFeedSql = `INSERT INTO feeds (channel_url, custom_title) VALUES (?, ?);`;

  for (let feed of defaultFeeds) {
    await insertFeed(db, {
      channel_url: feed.channel_url,
      custom_title: feed.custom_title,
    });
  }
};

export const createSettingsTable = async db => {
  const querySettings = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `;
  await db.executeSql(querySettings);
  // Add a default setting for link behavior
  await db.executeSql(`
    INSERT OR IGNORE INTO settings (key, value) VALUES ('linkBehavior', 'webview');
  `);
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
  await createSettingsTable(db);
  await initializeDataIfNeeded(db);
};

export const saveSetting = async (key, value) => {
  const db = await getDBConnection();
  await createSettingsTable(db);
  await db.executeSql(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?);',
    [key, value],
  );
};

export const getSetting = async key => {
  const db = await getDBConnection();
  await createSettingsTable(db);
  const results = await db.executeSql(
    'SELECT value FROM settings WHERE key = ?;',
    [key],
  );
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0).value;
  } else {
    return null;
  }
};

export const updateSetting = async (db, key, value) => {
  await db.executeSql('UPDATE settings SET value = ? WHERE key = ?', [
    value,
    key,
  ]);
};

export const parseFeed = async url => {
  try {
    const response = await fetch(url);
    const responseData = await response.text();
    const parsed = await rssParser.parse(responseData);

    // Transform the parsed data to include imageUrl directly in each item if available
    const itemsWithImages = parsed.items.map(item => {
      const link = item.links && item.links[0] ? item.links[0].url : '';
      const uniqueId = item.id || `${url}-${item.title}`;
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
      return {
        title: item.title,
        link: item.links && item.links[0] ? item.links[0].url : '',
        description: item.description,
        published: item.published,
        imageUrl: imageUrl,
        uniqueId: item.id || `${url}-${item.title}`,
      };
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
  const {channel_url, custom_title} = feed;
  console.log('url', channel_url);
  const parsed = await parseFeed(channel_url);

  try {
    const insertQuery = `
      INSERT OR IGNORE INTO feeds (channel_url, title, custom_title, image, show_in_everything ) VALUES (?, ?, ?, ?, 1);
  `;
    await db.executeSql(insertQuery, [
      channel_url,
      parsed.title,
      custom_title || '',
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

      const postResults = await db.executeSql(
        'SELECT * FROM posts WHERE post_unique_id = ?',
        [uniqueId],
      );

      if (postResults[0].rows.length > 0) {
        // Update existing post
        const updateQuery = `
          UPDATE posts SET
            channel_id = ?, 
            title = ?,
            link = ?,
            description = ?,
            published = ?,
            imageUrl = ?
          WHERE post_unique_id = ?
        `;
        await db.executeSql(updateQuery, [
          channel_id,
          title,
          link,
          description,
          published,
          imageUrl,
          uniqueId,
        ]);
        // console.log(
        //   `Updated post with unique ID: ${uniqueId} for channel: ${channel_id}`,
        // );
      } else {
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
      }
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

export const savePost = async (db, postId) => {
  await db.executeSql(
    'UPDATE posts SET is_saved = 1 WHERE post_unique_id = ?',
    [postId],
  );
};

export const unsavePost = async (db, postId) => {
  await db.executeSql(
    'UPDATE posts SET is_saved = 0 WHERE post_unique_id = ?',
    [postId],
  );
};

export const getSavedPosts = async db => {
  const results = await db.executeSql('SELECT * FROM posts WHERE is_saved = 1');
  let posts = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    posts.push(results[0].rows.item(i));
  }
  return posts;
};

export const postExistsInDB = async (db, uniqueId) => {
  try {
    const results = await db.executeSql(
      'SELECT COUNT(*) AS count FROM posts WHERE post_unique_id = ?',
      [uniqueId],
    );
    return results[0].rows.item(0).count > 0;
  } catch (error) {
    console.error('Error checking if post exists in DB:', error);
    throw error;
  }
};

export const countNewPosts = async (db, feedId) => {
  const results = await db.executeSql(
    'SELECT COUNT(*) AS newPostsCount FROM posts WHERE channel_id = ? AND is_viewed = 0',
    [feedId],
  );
  return results[0].rows.item(0).newPostsCount;
};

export const markPostsAsSeen = async (db, feedId) => {
  try {
    await db.executeSql('UPDATE posts SET is_viewed = 1 WHERE channel_id = ?', [
      feedId,
    ]);
  } catch (error) {
    console.error('Error marking posts as seen:', error);
    throw error;
  }
};

export const updateUnseenCount = async (db, feedId, count) => {
  try {
    await db.executeSql('UPDATE feeds SET unseen_count = ? WHERE id = ?', [
      count,
      feedId,
    ]);
  } catch (error) {
    console.error('Error updating unseen count:', error);
    throw error;
  }
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
    const results = await db.executeSql(
      'SELECT id, channel_url, title, custom_title, show_in_everything, unseen_count FROM feeds;',
    );
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

export const toggleShowInEverything = async (db, feedId, currentValue) => {
  const newValue = currentValue ? 0 : 1;
  await db.executeSql('UPDATE feeds SET show_in_everything = ? WHERE id = ?', [
    newValue,
    feedId,
  ]);
};

export const renameFeed = async (db, feedId, newTitle) => {
  console.log('renaming:', feedId, newTitle);
  await db.executeSql('UPDATE feeds SET custom_title = ? WHERE id = ?', [
    newTitle,
    feedId,
  ]);
};

export const deleteFeed = async (db, feedId) => {
  try {
    await db.executeSql('DELETE FROM feeds WHERE id = ?', [feedId]);
    console.log('Feed deleted successfully');
  } catch (error) {
    console.error('Failed to delete feed:', error);
  }
};

// Folders
export const insertFolder = async (db, folderName) => {
  const insertQuery = 'INSERT INTO folders (name) VALUES (?);';
  try {
    const result = await db.executeSql(insertQuery, [folderName]);
    return result[0].insertId; // Return the last inserted ID
  } catch (error) {
    if (error.code === 6) {
      throw new Error('A folder with this name already exists.');
    }
    throw error;
  }
};

export const createFolder = async folderName => {
  const db = await getDBConnection();
  const folderId = await insertFolder(db, folderName);
  return folderId;
};

export const updateFolder = async (db, folderId, newName) => {
  const updateQuery = `UPDATE folders SET name = ? WHERE id = ?;`;
  await db.executeSql(updateQuery, [newName, folderId]);
};

export const deleteFolder = async (db, folderId) => {
  await db.executeSql('DELETE FROM feed_folders WHERE folder_id = ?', [
    folderId,
  ]);
  const deleteQuery = `DELETE FROM folders WHERE id = ?;`;
  await db.executeSql(deleteQuery, [folderId]);
};

export const addFeedToFolder = async (db, folderId, feedId) => {
  const insertQuery = `INSERT INTO feed_folders (folder_id, feed_id) VALUES (?, ?);`;
  await db.executeSql(insertQuery, [folderId, feedId]);
};

export const removeFeedFromFolder = async (db, folderId, feedId) => {
  const deleteQuery = `DELETE FROM feed_folders WHERE folder_id = ? AND feed_id = ?;`;
  await db.executeSql(deleteQuery, [folderId, feedId]);
};

export const getFeedsInFolder = async (db, folderId) => {
  const query = `
    SELECT feeds.* FROM feeds
    JOIN feed_folders ON feeds.id = feed_folders.feed_id
    WHERE feed_folders.folder_id = ?;
  `;
  const results = await db.executeSql(query, [folderId]);
  const feeds = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    feeds.push(results[0].rows.item(i));
  }
  return feeds;
};

export const getFeedsNotInFolder = async db => {
  const results = await db.executeSql(`
    SELECT feeds.*
    FROM feeds
    LEFT JOIN feed_folders ON feeds.id = feed_folders.feed_id
    WHERE feed_folders.feed_id IS NULL;
  `);
  const feeds = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    feeds.push(results[0].rows.item(i));
  }
  return feeds;
};

export const getAllFolders = async db => {
  const results = await db.executeSql('SELECT * FROM folders;');
  const folders = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    folders.push(results[0].rows.item(i));
  }
  return folders;
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
    await db.executeSql('DROP TABLE IF EXISTS folders;');
    await db.executeSql('DROP TABLE IF EXISTS feed_folders;');

    // Recreate tables
    await createTables(db); // Assuming this function creates all necessary tables
    await createSettingsTable(db);
    console.log('Database has been reset and tables recreated.');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

const migrations = {
  1: async db => {
    // Migration for version 1
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS feeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_url TEXT UNIQUE,
        title TEXT,
        custom_title TEXT,
        image TEXT,
        show_in_everything INTEGER DEFAULT 1
      );
    `);
    await db.executeSql(`
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
        unseen BOOLEAN DEFAULT 1,
        FOREIGN KEY (channel_id) REFERENCES feeds (id)
      );
    `);
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      );
    `);
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS feed_folders (
        folder_id INTEGER,
        feed_id INTEGER,
        FOREIGN KEY (folder_id) REFERENCES folders (id),
        FOREIGN KEY (feed_id) REFERENCES feeds (id),
        PRIMARY KEY (folder_id, feed_id)
      );
    `);
  },
  2: async db => {
    // Migration for version 2
    await db.executeSql(`
      ALTER TABLE feeds ADD COLUMN new_field TEXT DEFAULT '';
    `);
    // Add more fields or modify tables as needed
  },
  // Add more migrations here for future versions
};

const getCurrentVersion = async db => {
  const result = await db.executeSql(`
    SELECT MAX(version) as version FROM migrations;
  `);
  return result[0].rows.item(0).version || 0;
};

const setCurrentVersion = async (db, version) => {
  await db.executeSql(
    `
    INSERT INTO migrations (version) VALUES (?);
  `,
    [version],
  );
};

// export const initializeDatabase = async () => {
//   const db = await getDBConnection();
//   await createMigrationsTable(db);

//   const currentVersion = await getCurrentVersion(db);

//   for (
//     let version = currentVersion + 1;
//     version <= databaseVersion;
//     version++
//   ) {
//     if (migrations[version]) {
//       await migrations[version](db);
//       await setCurrentVersion(db, version);
//     }
//   }
// };

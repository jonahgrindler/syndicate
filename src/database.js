import SQLite from 'react-native-sqlite-storage';

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
  const query = `
    CREATE TABLE IF NOT EXISTS feeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT
    );
  `;

  await db.executeSql(query);
};

// Setup default feeds
export const setupDefaultFeeds = async (db, userId) => {
  // Your test data insertion logic
  console.log('Inserting initial test data');
  const defaultFeeds = [
    {
      url: 'https://feeds2.feedburner.com/itsnicethat/SlXC',
    },
    {
      url: 'https://anothergraphic.org/feed/',
    },
    {
      url: 'https://thecreativeindependent.com/feed.xml',
    },
  ];
  const insertFeedSql = `INSERT INTO feeds (url) VALUES (?);`;
  for (let feed of defaultFeeds) {
    await db.executeSql(insertFeedSql, [feed.url]);
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

export const insertFeed = async (db, feed) => {
  const {url} = feed;
  try {
    const insertQuery = `
      INSERT INTO feeds (url) VALUES (?);
  `;
    await db.executeSql(insertQuery, [url]);
    console.log('Feed added successfully:', url);
  } catch (error) {
    console.error('Failed to add feed:', error);
    throw error;
  }
};

export const getFeeds = async db => {
  try {
    const feeds = [];
    const results = await db.executeSql(`SELECT id, url FROM feeds;`);
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

export const deleteDatabase = async () => {
  const path = 'FeedsDB.db'; // The name of your database file
  return SQLite.deleteDatabase({name: path, location: 'default'});
};

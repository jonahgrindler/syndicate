import React from 'react';
import {Button, View} from 'react-native';
import {
  getDBConnection,
  createTables,
  setupDefaultFeeds,
  getFeeds,
} from '../database';

const TestDatabase = () => {
  const testDatabase = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);
      await setupDefaultFeeds(db);
      const feeds = await getFeeds(db);
      console.log('Feeds:', feeds);
    } catch (error) {
      console.error('Database Test Failed:', error);
    }
  };

  return (
    <View>
      <Button title="Test Database" onPress={testDatabase} />
    </View>
  );
};

export default TestDatabase;

import React from 'react';
import {Button, View} from 'react-native';
import {
  getDBConnection,
  createTables,
  setupDefaultFeeds,
  getFeeds,
  resetDatabaseTables,
} from '../database';

const ResetDatabase = () => {
  const handleReset = async () => {
    const db = await getDBConnection();
    await resetDatabaseTables(db);
    // Or to delete the database entirely
    // await deleteDatabase();
  };

  return (
    <View>
      <Button title="Reset Database" onPress={handleReset} />
    </View>
  );
};

export default ResetDatabase;

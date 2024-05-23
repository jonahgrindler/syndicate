import React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {
  getDBConnection,
  createTables,
  setupDefaultFeeds,
  getFeeds,
  resetDatabaseTables,
} from '../database';
import {fonts, spacing, useTheme} from '../styles/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ResetDatabase = () => {
  const {primaryColor, secondaryColor} = useTheme();
  const handleReset = async () => {
    const db = await getDBConnection();
    await resetDatabaseTables(db);
    // Or to delete the database entirely
    // await deleteDatabase();
  };

  return (
    <TouchableOpacity
      title="Reset Database"
      onPress={handleReset}
      style={[styles.button, {borderColor: primaryColor}]}>
      <Text style={[styles.buttonText, {color: primaryColor}]}>
        Reset Database
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: spacing.row,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: spacing.leftRightMargin,
    borderRadius: 24,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
});

export default ResetDatabase;

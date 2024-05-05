import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {RootStackParamList} from './src/types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import FeedAggregator from './src/components/FeedAggregator';

function Home() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToSettings = () => {
    navigation.navigate('SettingsScreen');
  };
  const goToSaved = () => {
    navigation.navigate('SavedScreen');
  };

  return (
    <>
      <FeedAggregator />
      <Button
        title="Settings"
        onPress={() => {
          goToSettings();
        }}
      />
      <Button
        title="Saves"
        onPress={() => {
          goToSaved();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;

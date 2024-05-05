import React from 'react';
import {Button, View, StyleSheet, Text} from 'react-native';
import {RootStackParamList} from './src/types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

function Saved() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToSettings = () => {
    navigation.navigate('SettingsScreen');
  };

  return (
    <View style={styles.center}>
      <Text>Saved</Text>
      <Button
        title="Go to Settings"
        onPress={() => {
          goToSettings();
        }}
      />
      <Button
        title="Go Back"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Saved;

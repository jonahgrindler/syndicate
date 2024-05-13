import React from 'react';
import {Button, View, StyleSheet, Text} from 'react-native';
import {RootStackParamList} from './src/types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import ResetDatabase from './src/components/ResetDatabase';

function Settings() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToSaved = () => {
    navigation.navigate('SavedScreen');
  };

  return (
    <View style={styles.center}>
      <Text>Settings</Text>
      <ResetDatabase />
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

export default Settings;

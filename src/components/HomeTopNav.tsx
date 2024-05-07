import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, images, spacing} from '../styles/theme';

const HomeTopNav = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const goToAddFeed = () => {
    navigation.navigate('AddFeed');
  };
  const goToSettings = () => {
    navigation.navigate('SettingsScreen');
  };
  const goToSaved = () => {
    navigation.navigate('SavedScreen');
  };
  return (
    <SafeAreaView edges={['top']} style={styles.safeAreaView}>
      <View style={styles.navigation}>
        <View style={styles.leftNav}>
          <TouchableOpacity
            onPress={() => {
              goToAddFeed();
            }}
            style={styles.button}>
            <Image source={require('../../assets/icons/search.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              goToSaved();
            }}
            style={styles.button}>
            <Image source={require('../../assets/icons/save.png')} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            goToSettings();
          }}
          style={styles.button}>
          <Image source={require('../../assets/icons/more.png')} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 0,
    backgroundColor: colors.background,
  },
  navigation: {
    backgroundColor: colors.background,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  leftNav: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgLight,
    borderRadius: 40,
  },
});

export default HomeTopNav;

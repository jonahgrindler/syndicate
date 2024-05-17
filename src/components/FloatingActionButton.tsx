import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, images, spacing} from '../styles/theme';
import {useTheme} from '../styles/theme';

const FloatingActionButton = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {primaryColor, secondaryColor} = useTheme();
  const goToAddFeed = () => {
    navigation.navigate('AddFeed');
  };
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaView}>
      <TouchableOpacity
        onPress={() => {
          goToAddFeed();
        }}
        style={[styles.button, {backgroundColor: primaryColor}]}>
        <Image
          source={require('../../assets/icons/plus.png')}
          style={{tintColor: secondaryColor}}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 0,
    position: 'absolute',
    bottom: spacing.leftRightMargin,
    right: spacing.leftRightMargin,
  },
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.slate,
    borderRadius: 40,
  },
});

export default FloatingActionButton;

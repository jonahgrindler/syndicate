import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import ChannelMenu from './ChannelMenu';

const navButton: React.FC<any> = ({label, buttonHeight, to}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Feed'>>();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();

  const handleNavigation = to => {
    navigation.navigate(to);
  };

  return (
    <TouchableOpacity
      onPress={() => handleNavigation(to)}
      style={[
        styles.button,
        {height: buttonHeight, borderColor: primaryColor},
      ]}>
      <Text style={[styles.navText, {color: primaryColor}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    // height: 106,
    borderRadius: 24,
    borderColor: colors.primary,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  navText: {
    fontSize: fonts.size.nav,
    lineHeight: fonts.lineHeight.nav,
    fontWeight: fonts.weight.semibold,
    letterSpacing: -0.2,
    color: colors.primary,
  },
});

export default navButton;

// https://github.com/naeemur/react-native-wheel-color-picker#readme

import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {fonts, spacing, useTheme} from '../styles/theme';
import {colors} from '../styles/theme';
import ColorPicker from 'react-native-wheel-color-picker';

const ThemePicker = () => {
  const {setTheme} = useTheme();
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [secondaryColor, setSecondaryColor] = useState('#000000');

  const handleSubmit = () => {
    setTheme(primaryColor, secondaryColor);
  };

  const onPrimaryColorChange = selectedColor => {
    setPrimaryColor(selectedColor);
    setTheme(primaryColor, secondaryColor);
  };
  const onSecondaryColorChange = selectedColor => {
    setSecondaryColor(selectedColor);
    setTheme(primaryColor, secondaryColor);
  };

  return (
    <View style={styles.themePicker}>
      <View style={styles.themeInputs}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: primaryColor}]}>
            Foreground Color
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: secondaryColor,
                borderBlockColor: primaryColor,
                backgroundColor: primaryColor,
              },
            ]}
            value={primaryColor}
            onChangeText={setPrimaryColor}
            placeholder="#ffffff"
          />
          <ColorPicker
            ref={r => {
              this.picker = r;
            }}
            color={primaryColor}
            onColorChange={onPrimaryColorChange}
            // onColorChangeComplete: (color) => {}
            thumbSize={30}
            sliderSize={20}
            gapSize={16}
            shadeWheelThumb={false}
            shadeSliderThumb={false}
            noSnap={false}
            row={false}
            swatches={false}
            useNativeDriver={true}
            useNativeLayout={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: primaryColor}]}>
            Background Color
          </Text>
          <TextInput
            style={[
              styles.input,
              {color: secondaryColor, backgroundColor: primaryColor},
            ]}
            value={secondaryColor}
            onChangeText={setSecondaryColor}
            placeholder="#000000"
          />
          <ColorPicker
            ref={r => {
              this.picker = r;
            }}
            color={secondaryColor}
            onColorChange={onSecondaryColorChange}
            // onColorChangeComplete: (color) => {}
            thumbSize={30}
            sliderSize={20}
            gapSize={16}
            noSnap={true}
            row={false}
            swatches={false}
            useNativeDriver={true}
            useNativeLayout={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  themePicker: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 44,
  },
  themeInputs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: spacing.leftRightMargin,
    gap: 16,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: 56,
    padding: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  label: {
    color: colors.dark.primary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
    // textAlign: 'center',
  },
});

export default ThemePicker;

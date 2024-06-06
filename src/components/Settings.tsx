import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import {FeedProps, FeedItem} from '../types/FeedTypes';
import {RootStackParamList} from '../types/RootStackParamList';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import DashedLine from 'react-native-dashed-line';
import {colors, fonts, spacing} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {useTheme} from '../styles/theme';
import ResetDatabase from './ResetDatabase';
import allColors from '../data/allColors';

const Settings: React.FC = ({feedContent}) => {
  const {setTheme, primaryColor, secondaryColor, highlightColor} = useTheme();
  const insets = useSafeAreaInsets();

  const [newPrimary, setNewPrimary] = useState(primaryColor);
  const [newSecondary, setNewSecondary] = useState(secondaryColor);
  const [newHighlight, setNewHighlight] = useState(highlightColor);

  const handlePrimary = color => {
    setNewPrimary(color);
    setTheme(color, secondaryColor, highlightColor);
  };
  const handleSecondary = color => {
    setNewSecondary(color);
    setTheme(primaryColor, color, highlightColor);
  };
  const handleHighlight = color => {
    setNewHighlight(color);
    setTheme(primaryColor, secondaryColor, color);
  };

  // TODO : Using react DOM, somethings not working
  function pickRandomColor() {
    let number = Math.floor(Math.random() * allColors.length);
    return number;
  }

  const randomColors = () => {
    const {primaryColor, secondaryColor} = useTheme();

    setNewPrimary(allColors[pickRandomColor()]);
    setNewSecondary(allColors[pickRandomColor()]);
    setTheme(newPrimary, newSecondary, highlightColor);
  };

  // const navigation =
  //   useNavigation<
  //     NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>
  //   >();
  // const handleNavigation = (item: FeedItem) => {
  //   console.log('item:', item);
  //   navigation.navigate('FeedWebView', {
  //     url: item.link,
  //     postId: item.post_unique_id,
  //   });
  // };

  return (
    <ScrollView style={[styles.scrollView, {paddingTop: insets.top + 8}]}>
      <View style={styles.section}>
        <DashedLine
          dashLength={3}
          dashThickness={3}
          dashGap={5}
          dashColor={primaryColor}
          dashStyle={{borderRadius: 5, marginBottom: 8}}
        />
        <Text style={[styles.smallTitle, {color: primaryColor}]}>Palette</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, {color: primaryColor}]}
            value={newPrimary}
            onChangeText={handlePrimary}
            placeholder="#ffffff"
          />
          <View
            style={[
              styles.colorCircle,
              {backgroundColor: primaryColor, borderColor: primaryColor},
            ]}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, {color: primaryColor}]}
            value={newSecondary}
            onChangeText={handleSecondary}
            placeholder="#ffffff"
          />
          <View
            style={[
              styles.colorCircle,
              {backgroundColor: secondaryColor, borderColor: primaryColor},
            ]}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, {color: highlightColor}]}
            value={newHighlight}
            onChangeText={handleHighlight}
            placeholder="#ffffff"
          />
          <View
            style={[
              styles.colorCircle,
              {backgroundColor: highlightColor, borderColor: highlightColor},
            ]}
          />
        </View>
        <TouchableOpacity
          title="Randomize Color"
          onPress={randomColors}
          style={[styles.button, {borderColor: primaryColor}]}>
          <Text style={[styles.buttonText, {color: primaryColor}]}>
            Randomize colors
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          title="Original Colors"
          onPress={randomColors}
          style={[styles.button, {borderColor: primaryColor}]}>
          <Text style={[styles.buttonText, {color: primaryColor}]}>
            Original colors
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <DashedLine
          dashLength={3}
          dashThickness={3}
          dashGap={5}
          dashColor={primaryColor}
          dashStyle={{borderRadius: 5, marginBottom: 8}}
        />
        <Text style={[styles.smallTitle, {color: primaryColor}]}>Reset</Text>
        <View style={styles.sectionContent}>
          <ResetDatabase />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingRight: 8,
  },
  section: {
    paddingBottom: 40,
  },
  sectionContent: {
    paddingTop: 12,
  },
  smallTitle: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: fonts.weight.semibold,
    color: colors.primary,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: fonts.weight.semibold,
    color: colors.primary,
  },
  input: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: fonts.weight.semibold,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    borderWidth: 2,
  },
  button: {
    flex: 1,
    height: spacing.row,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: spacing.leftRightMargin,
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
});

export default Settings;

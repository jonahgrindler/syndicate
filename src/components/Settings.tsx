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
      </View>
      <View style={styles.section}>
        <DashedLine
          dashLength={3}
          dashThickness={3}
          dashGap={5}
          dashColor={primaryColor}
          dashStyle={{borderRadius: 5, marginBottom: 8}}
        />
        <Text style={[styles.smallTitle, {color: primaryColor}]}>Account</Text>
        <Text style={[styles.text, {color: primaryColor}]}>Sign Up</Text>
        <Text style={[styles.text, {color: primaryColor}]}>Sign In</Text>
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
  postImage: {
    width: '100%',
    height: 160,
    marginBottom: 8,
    borderRadius: 1,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.secondary,
  },
});

export default Settings;

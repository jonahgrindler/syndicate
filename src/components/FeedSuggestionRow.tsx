import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import allColors from '../data/allColors';

const FeedSuggestionRow: React.FC = ({url, title, icon, isAdded}) => {
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const {addNewFeed} = useFeed();
  const [added, setAdded] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);

  // Adding a new Feed
  const handleAddFeed = async feedUrl => {
    const fetchFeed = async () => {
      try {
        setPendingAdd(true);
        await addNewFeed(feedUrl);
        // navigation.goBack();
        setPendingAdd(false);
        setAdded(true);
      } catch (error) {
        console.error('Failed to fetch or parse feeds:', error);
      }
    };
    fetchFeed();
  };

  function pickRandomColor() {
    let number = Math.floor(Math.random() * allColors.length);
    return allColors[number];
  }

  return (
    <View style={styles.suggestion}>
      <View style={styles.iconTitle}>
        {icon ? (
          <Image source={{uri: icon}} style={[styles.icon]} />
        ) : (
          <View style={[styles.icon, {backgroundColor: pickRandomColor()}]} />
        )}
        <View>
          <Text style={[styles.text, {color: primaryColor}]}>
            {title || url}
          </Text>
          {/* <Text style={[styles.textSmall, {color: primaryColor}]}>{url}</Text> */}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleAddFeed(url)}>
        <View style={[styles.plusIcon, {borderColor: primaryColor}]}>
          {pendingAdd ? (
            <ActivityIndicator size="small" color={primaryColor} />
          ) : isAdded ? (
            <Image
              source={require('../../assets/icons/check.png')}
              tintColor={primaryColor}
            />
          ) : (
            <Image
              source={require('../../assets/icons/plus.png')}
              tintColor={primaryColor}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconTitle: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold, // causing prettier error
    flexShrink: 1,
    paddingRight: 48,
  },
  textSmall: {
    flex: 0,
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: 48,
  },
  plusIcon: {
    borderWidth: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});

export default FeedSuggestionRow;

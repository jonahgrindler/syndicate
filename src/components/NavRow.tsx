import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {trigger} from 'react-native-haptic-feedback';
import ChannelMenu from './ChannelMenu';

const NavRow: React.FC<any> = ({title, selected, newCount, feedId}) => {
  const {
    handleSelectedFeedId,
    selectedFeedId,
    handleDelete,
    showSaved,
    setShowSaved,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (feedId === selectedFeedId) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedFeedId]);

  // Optional configuration
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  function haptics() {
    trigger('impactLight', options);
  }
  function hapticsPressIn() {
    trigger('soft', options);
  }

  return (
    <ChannelMenu onDelete={handleDelete} feedId={feedId} feedTitle={title}>
      <TouchableOpacity
        style={styles.navRow}
        onPressIn={hapticsPressIn}
        onPress={() => [handleSelectedFeedId(feedId), haptics()]}>
        {isSelected ? (
          <View style={[styles.dot, {backgroundColor: primaryColor}]} />
        ) : null}
        <Text
          style={[
            styles.navText,
            newCount > 0
              ? {color: highlightColor, maxWidth: 120, width: 'auto'}
              : {color: primaryColor},
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        {newCount > 0 ? (
          <Text style={[styles.newCount, {color: highlightColor}]}>
            {newCount}
          </Text>
        ) : null}
      </TouchableOpacity>
    </ChannelMenu>
  );
};

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    marginRight: 3,
  },
  navText: {
    fontSize: fonts.size.nav,
    lineHeight: fonts.lineHeight.nav,
    fontWeight: fonts.weight.semibold,
    letterSpacing: -0.2,
    color: colors.primary,
  },
  newCount: {
    fontSize: 12,
    fontWeight: fonts.weight.bold,
    paddingLeft: 1,
  },
});

export default NavRow;

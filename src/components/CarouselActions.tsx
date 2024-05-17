import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, Image, View, StyleSheet, Pressable, Animated} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors, fonts} from '../styles/theme';
import {useTheme} from '../styles/theme';

const CarouselActions = ({feedContent, handleLargeImages, largeImages}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {primaryColor, secondaryColor} = useTheme();

  const goToChannelAllPosts = () => {
    navigation.navigate('ChannelAllPosts', {feedContent});
  };

  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 0.9];
  const scale = animation.interpolate({inputRange, outputRange});

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.carouselActions}>
        <Animated.View style={[styles.button, {transform: [{scale}]}]}>
          <Pressable
            style={styles.button}
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleLargeImages}>
            {largeImages ? (
              <>
                <Image
                  source={require('../../assets/icons/expand.png')}
                  style={{tintColor: primaryColor}}
                />
                <Text style={[styles.buttonText, {color: primaryColor}]}>
                  Large Images
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={require('../../assets/icons/shrink.png')}
                  style={{tintColor: primaryColor}}
                />
                <Text style={[styles.buttonText, {color: primaryColor}]}>
                  Small Images
                </Text>
              </>
            )}
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.button, {transform: [{scale}]}]}>
          <Pressable
            style={styles.button}
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={goToChannelAllPosts}>
            <Image
              source={require('../../assets/icons/view-all.png')}
              style={{tintColor: primaryColor}}
            />
            <Text style={[styles.buttonText, {color: primaryColor}]}>
              View All
            </Text>
          </Pressable>
        </Animated.View>
      </View>
      <View style={styles.line} />
    </>
  );
};

const styles = StyleSheet.create({
  carouselActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    fontSize: fonts.size.medium,
    fontWeight: 'bold',
    color: colors.dark.primary,
  },
  line: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
    marginLeft: 16,
    height: 3,
    backgroundColor: colors.dark.line,
    borderRadius: 2,
  },
});

export default CarouselActions;

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, Image, View, StyleSheet, Pressable} from 'react-native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors, fonts} from '../styles/theme';

const CarouselActions = ({feedContent}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToChannelAllPosts = () => {
    navigation.navigate('ChannelAllPosts', {feedContent});
  };

  return (
    <>
      <View style={styles.carouselActions}>
        <View style={styles.button}>
          <Image source={require('../../assets/icons/expand.png')} />
          <Text style={styles.buttonText}>Large Images</Text>
        </View>
        <Pressable style={styles.button} onPress={goToChannelAllPosts}>
          <Image source={require('../../assets/icons/view-all.png')} />
          <Text style={styles.buttonText}>View All</Text>
        </Pressable>
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

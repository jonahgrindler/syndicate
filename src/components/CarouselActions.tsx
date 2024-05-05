import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';

const CarouselActions = () => {
  return (
    <>
      <View style={styles.carouselActions}>
        <View style={styles.button}>
          <Image source={require('../../assets/icons/chevron.png')} />
          <Text>Large Images</Text>
        </View>
        <View style={styles.button}>
          <Text>View All</Text>
        </View>
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
    fontSize: 15,
  },
  line: {
    marginTop: 16,
    marginRight: 16,
    marginBottom: 8,
    marginLeft: 16,
    height: 3,
    backgroundColor: '#3A4048',
    opacity: 0.1,
    borderRadius: 2,
  },
});

export default CarouselActions;

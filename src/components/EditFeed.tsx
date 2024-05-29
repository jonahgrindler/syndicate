import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/RootStackParamList';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useFeed} from '../context/FeedContext';
import {trigger} from 'react-native-haptic-feedback';

type EditFeedRouteProp = RouteProp<RootStackParamList, 'EditFeed'>;

const EditFeed: React.FC<any> = () => {
  const route = useRoute<EditFeedRouteProp>();
  const {feedId, currentTitle} = route.params;
  const {handleRenameFeed, feedData, handleSelectedFeedId, selectedFeedId} =
    useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'EditFeed'>>();
  const [newFeedTitle, setNewFeedTitle] = useState(currentTitle);

  console.log('newFeedTitle:', newFeedTitle);

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveRename = async () => {
    await handleRenameFeed(feedId, newFeedTitle);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.page, {backgroundColor: secondaryColor}]}>
      <View style={styles.navActions}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.navButton, {color: primaryColor}]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => saveRename()}>
          <Text style={[styles.navButton, {color: primaryColor}]}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={[styles.input, {color: primaryColor, borderColor: primaryColor}]}
        placeholderTextColor={primaryColor}
        onChangeText={setNewFeedTitle}
        value={newFeedTitle}
        placeholder="Title"
        ref={inputRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  navActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.leftRightMargin,
    marginTop: 24,
    marginBottom: 40,
  },
  navButton: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  input: {
    borderWidth: 2,
    marginHorizontal: spacing.leftRightMargin,
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 40,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
});

export default EditFeed;

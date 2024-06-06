// SelectFeeds.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/RootStackParamList';
import {useFeed} from '../context/FeedContext';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {SafeAreaView} from 'react-native-safe-area-context';

const SelectFeeds = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'SelectFeeds'>>();
  const route = useRoute();
  const {folderId, newFolderName} = route.params;
  console.log('folderId', folderId);
  const {feeds, handleAddFeedToFolder} = useFeed();
  const [selectedFeeds, setSelectedFeeds] = useState([]);
  const {primaryColor, secondaryColor, highlightColor} = useTheme();

  useEffect(() => {
    // Fetch feeds from database if needed
  }, []);

  const toggleFeedSelection = feedId => {
    setSelectedFeeds(prev =>
      prev.includes(feedId)
        ? prev.filter(id => id !== feedId)
        : [...prev, feedId],
    );
  };

  const handleDone = async () => {
    await Promise.all(
      selectedFeeds.map(feedId => handleAddFeedToFolder(folderId, feedId)),
    );
    console.log('Selected Feeds Added to folder:', selectedFeeds);
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: secondaryColor}]}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Text style={[styles.text, {color: primaryColor}]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleDone();
          }}
          style={styles.back}>
          <Text style={[styles.text, {color: primaryColor}]}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.folderHeader}>
        <Image
          source={require('../../assets/icons/folder.png')}
          tintColor={primaryColor}
        />
        <Text style={[styles.text, {color: primaryColor}]}>
          {newFolderName}
        </Text>
      </View>
      <FlatList
        data={feeds}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.feedItem]}
            onPress={() => toggleFeedSelection(item.id)}>
            <Text style={[styles.text, {color: primaryColor}]}>
              {item.title}
            </Text>
            <View style={[styles.plus, {borderColor: primaryColor}]}>
              {selectedFeeds.includes(item.id) ? (
                <Image
                  source={require('../../assets/icons/minus.png')}
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
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 16,
  },
  folderHeader: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  feedItem: {
    paddingVertical: 16,
    paddingHorizontal: spacing.leftRightMargin,
    // borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plus: {
    borderWidth: 2,
    borderRadius: 32,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFeedItem: {
    backgroundColor: '#e0e0e0',
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: spacing.leftRightMargin,
  },
});

export default SelectFeeds;

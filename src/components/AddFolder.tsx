import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SectionList,
  Alert,
} from 'react-native';
import {useFeed} from '../context/FeedContext';
import {createFolder} from '../database';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';
import FeedSuggestionRow from './FeedSuggestionRow';
import {SafeAreaView} from 'react-native-safe-area-context';
import DashedLine from 'react-native-dashed-line';
import color from 'color';

const AddFolder = () => {
  const {
    folders,
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleAddFeedToFolder,
    handleRemoveFeedFromFolder,
    feeds,
  } = useFeed();
  const {primaryColor, secondaryColor, highlightColor} = useTheme();
  const placeholderColorWithOpacity = color(primaryColor)
    .alpha(0.5)
    .rgb()
    .string();
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'AddFolder'>>();

  const handleNext = async () => {
    try {
      const folderId = await createFolder(newFolderName);
      navigation.navigate('SelectFeeds', {folderId, newFolderName});
    } catch (error) {
      if (error.message === 'A folder with this name already exists.') {
        Alert.alert('Error', 'A folder with this name already exists.');
      } else {
        console.error('Failed to create folder:', error);
      }
    }
  };

  const sections = [
    {
      title: 'Add to Folder',
      data: feeds,
    },
  ];

  const renderFeedItem = ({item}) => {
    const isAdded = feeds.some(feed => feed.channel_url === item.url);

    return (
      <FeedSuggestionRow
        url={item.url}
        title={item.custom_title || item.title}
        icon={item.icon}
        isAdded={isAdded}
        forFolder={true}
        folderId={folderId}
      />
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: secondaryColor}]}>
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Text style={[styles.buttonText, {color: primaryColor}]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleNext();
          }}
          style={styles.back}>
          <Text style={[styles.buttonText, {color: primaryColor}]}>Next</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, {color: primaryColor}]}
        placeholder="Folder Name"
        value={newFolderName}
        onChangeText={setNewFolderName}
        placeholderTextColor={placeholderColorWithOpacity}
        multiline={true}
      />
      {/* <FlatList
        data={feeds}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.feedRow}>
            <Text style={[styles.feedName, {color: primaryColor}]}>
              {item.custom_title || item.title}
            </Text>
            <View style={styles.flexHorizontal}>
              <Button
                title="Add"
                onPress={() => handleAddFeedToFolder(folder.id, item.id)}
              />
              <Button
                title="Remove"
                onPress={() => removeFeedFromFolder(folder.id, item.id)}
              />
            </View>
          </View>
        )}
      /> */}
      {/* <SectionList
        style={styles.suggestionList}
        sections={sections}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({section: {title}}) => (
          <>
            {title === 'Search' ? null : (
              <View style={styles.sectionHeader}>
                <DashedLine
                  dashLength={3}
                  dashThickness={3}
                  dashGap={5}
                  dashColor={primaryColor}
                  dashStyle={{borderRadius: 5, marginBottom: 8}}
                />
                <Text style={[styles.text, {color: primaryColor}]}>
                  {title}
                </Text>
              </View>
            )}
          </>
        )}
        renderItem={renderFeedItem}
        ListFooterComponent={<View style={styles.footerSpace}></View>}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  navigation: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.bgLight,
    borderRadius: 40,
    flexDirection: 'row',
    gap: 4,
  },
  text: {
    fontSize: fonts.size.large,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 40,
    borderColor: colors.primary,
    marginBottom: 8,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semibold,
    height: '100%',
    textAlignVertical: 'top',
    marginTop: 20,
  },
  sectionHeader: {
    marginTop: 120,
    marginBottom: 48,
  },
  folderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flexHorizontal: {
    flexDirection: 'row',
  },
  plusIcon: {
    borderWidth: 2,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  folderName: {
    fontSize: fonts.size.medium,
  },
  editButton: {
    padding: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  editContainer: {
    marginTop: 16,
  },
  folderSection: {
    marginTop: 16,
  },
  feedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedName: {
    fontSize: fonts.size.medium,
  },
});

export default AddFolder;

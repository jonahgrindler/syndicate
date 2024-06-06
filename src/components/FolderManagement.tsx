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
} from 'react-native';
import {useFeed} from '../context/FeedContext';
import {colors, fonts, spacing, useTheme} from '../styles/theme';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';
import {StackNavigationProp} from '@react-navigation/stack';

const FolderManagement = () => {
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
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Folders'>>();

  const createFolder = async () => {
    if (newFolderName) {
      await handleCreateFolder(newFolderName);
      setNewFolderName('');
    }
  };

  const updateFolder = async () => {
    if (selectedFolderId && editFolderName) {
      await handleUpdateFolder(selectedFolderId, editFolderName);
      setEditFolderName('');
      setSelectedFolderId(null);
    }
  };

  const deleteFolder = async folderId => {
    await handleDeleteFolder(folderId);
  };

  return (
    <View style={[styles.container, {backgroundColor: secondaryColor}]}>
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}>
          <Image
            source={require('../../assets/icons/chevron-left.png')}
            tintColor={primaryColor}
          />
          <Text style={[styles.buttonText, {color: primaryColor}]}>Back</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="New Folder Name"
        value={newFolderName}
        onChangeText={setNewFolderName}
      />
      <Button title="Create Folder" onPress={createFolder} />

      <FlatList
        data={folders}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.folderRow}>
            <Text style={[styles.folderName, {color: primaryColor}]}>
              {item.name}
            </Text>
            <View>
              <TouchableOpacity
                style={[styles.editButton, {borderColor: primaryColor}]}
                onPress={() => {
                  setSelectedFolderId(item.id);
                  setEditFolderName(item.name);
                }}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFolder(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {selectedFolderId && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Edit Folder Name"
            value={editFolderName}
            onChangeText={setEditFolderName}
          />
          <Button title="Update Folder" onPress={updateFolder} />
        </View>
      )}

      <Text style={[styles.heading, {color: primaryColor}]}>
        Add Feeds to Folder
      </Text>
      {folders.map(folder => (
        <View key={folder.id} style={styles.folderSection}>
          <Text style={[styles.folderName, {color: primaryColor}]}>
            {folder.name}
          </Text>
          <FlatList
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
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  navigation: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.leftRightMargin,
    paddingRight: spacing.leftRightMargin,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.bgLight,
    borderRadius: 40,
    flexDirection: 'row',
    gap: 4,
  },
  heading: {
    fontSize: fonts.size.large,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderRadius: 40,
    borderColor: colors.primary,
    padding: 8,
    marginBottom: 8,
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

export default FolderManagement;

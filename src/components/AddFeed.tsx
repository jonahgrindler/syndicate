// FeedAggregator.tsx
import React, {useState} from 'react';
import {StyleSheet, TextInput, Button, View} from 'react-native';

interface AddFeedProps {
  onAddFeed: (url: string) => void; // Function to call when adding a feed
}

const AddFeed: React.FC<AddFeedProps> = ({onAddFeed}) => {
  const [newFeedUrl, setNewFeedUrl] = useState('');

  const handleAddFeed = () => {
    onAddFeed(newFeedUrl);
    setNewFeedUrl(''); // Reset input after adding
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={setNewFeedUrl}
        value={newFeedUrl}
        placeholder="Enter new feed URL"
        autoCapitalize="none"
      />
      <Button title="Add Website" onPress={handleAddFeed} />
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderColor: '#f1f1f1',
    padding: 10,
  },
});

export default AddFeed;

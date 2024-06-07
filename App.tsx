import React, {useEffect} from 'react';
import {initializeDatabase} from './src/database';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './src/types/RootStackParamList';
import FeedWebView from './src/components/FeedWebView';
import Saved from './src/components/Saved';
import Home from './Home';
import ChannelAllPosts from './src/components/ChannelAllPosts';
import {FeedProvider} from './src/context/FeedContext';
import {ThemeProvider} from './src/styles/theme';
import AddFeed from './src/components/AddFeed';
import SplitHome from './SplitHome';
import EditFeed from './src/components/EditFeed';
import FolderManagement from './src/components/FolderManagement';
import AddFolder from './src/components/AddFolder';
import SelectFeeds from './src/components/SelectFeeds';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    const initDB = async () => {
      await initializeDatabase();
    };
    initDB();
  }, []);
  return (
    <ThemeProvider>
      <FeedProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="HomeScreen" component={SplitHome} />
            <Stack.Screen name="AddFeed" component={AddFeed} />
            <Stack.Screen name="EditFeed" component={EditFeed} />
            <Stack.Screen name="Folders" component={FolderManagement} />
            <Stack.Screen name="AddFolder" component={AddFolder} />
            <Stack.Screen name="SelectFeeds" component={SelectFeeds} />
            <Stack.Screen
              name="SavedScreen"
              component={Saved}
              options={{
                title: 'Saved',
              }}
            />
            <Stack.Screen
              name="ChannelAllPosts"
              component={ChannelAllPosts}
              options={{
                title: 'Channel',
              }}
            />
            <Stack.Screen
              name="FeedWebView"
              component={FeedWebView}
              options={{headerTitle: 'Web View'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FeedProvider>
    </ThemeProvider>
  );
}

export default App;

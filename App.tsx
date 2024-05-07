import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './src/types/RootStackParamList';
import FeedWebView from './src/components/FeedWebView';
import Saved from './Saved';
import Settings from './Settings';
import Home from './Home';
import ChannelAllPosts from './src/components/ChannelAllPosts';
import {FeedProvider} from './src/context/FeedContext';
import AddFeed from './src/components/AddFeed';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <FeedProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="HomeScreen" component={Home} />
          <Stack.Screen name="AddFeed" component={AddFeed} />
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
            name="SettingsScreen"
            component={Settings}
            options={{
              title: 'Settings',
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
  );
}

export default App;

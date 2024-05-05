import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './src/types/RootStackParamList';
import FeedAggregator from './src/components/FeedAggregator';
import FeedWebView from './src/components/FeedWebView';
import Saved from './Saved';
import Settings from './Settings';
import Home from './Home';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: true,
        }}>
        <Stack.Screen name="HomeScreen" component={Home} />
        <Stack.Screen
          name="SavedScreen"
          component={Saved}
          options={{
            title: 'Saved',
          }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={Settings}
          options={{
            title: 'Settings',
          }}
        />
        {/* <Stack.Screen
          name="FeedWebView"
          component={FeedWebView}
          options={{headerTitle: 'Web View'}}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

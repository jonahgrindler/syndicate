import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import FeedAggregator from './src/components/FeedAggregator';
import FeedWebView from './src/components/FeedWebView';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FeedList"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="FeedAggregator" component={FeedAggregator} />
        {/* <Stack.Screen name="FeedWebView" component={FeedWebView} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

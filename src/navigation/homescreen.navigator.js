import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../scenes/home/home.component';

const Stack = createStackNavigator();

export const HomeScreenNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Home' component={HomeScreen}/>
  </Stack.Navigator>
);

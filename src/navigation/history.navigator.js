import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HistoryScreen } from '../scenes/history/history.component';

const Stack = createStackNavigator();

export const HistoryNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Histórico' component={HistoryScreen}/>
  </Stack.Navigator>
);

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UsersScreen } from '../scenes/users/users.component';

const Stack = createStackNavigator();

export const UsersNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Perfil' component={UsersScreen}/>
  </Stack.Navigator>
);

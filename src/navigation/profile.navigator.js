import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../scenes/profile/profile.component';

const Stack = createStackNavigator();

export const ProfileNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Perfil' component={ProfileScreen}/>
  </Stack.Navigator>
);

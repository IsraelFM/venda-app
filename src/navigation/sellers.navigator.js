import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SellersScreen } from '../scenes/sellers/sellers.component';

const Stack = createStackNavigator();

export const SellersNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Vendedores' component={SellersScreen}/>
  </Stack.Navigator>
);

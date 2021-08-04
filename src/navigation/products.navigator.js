import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from '../scenes/products/products.component';

const Stack = createStackNavigator();

export const ProductsNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Produtos' component={ProductsScreen}/>
  </Stack.Navigator>
);

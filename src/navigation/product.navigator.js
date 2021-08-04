import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductScreen } from '../scenes/product/product.component';

const Stack = createStackNavigator();

export const ProductNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Produto' component={ProductScreen}/>
  </Stack.Navigator>
);

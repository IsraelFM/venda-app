import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CartScreen } from '../scenes/order/cart.component';
import { CheckoutScreen } from '../scenes/order/checkout.component';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const CartMenuNavigator = () => (
  <TopTab.Navigator swipeEnabled={false} tabBar={() => {}}>
    <TopTab.Screen name='Carrinho' component={CartScreen}/>
    <TopTab.Screen name='Checkout' component={CheckoutScreen} />
  </TopTab.Navigator>
);

export const CartNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='FecharPedido' component={CartMenuNavigator}/>
  </Stack.Navigator>
);

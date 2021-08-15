import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { SellersScreen } from '../scenes/order/sellers.component';
import { ProductsBySellerScreen } from '../scenes/order/products-seller.component';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const OrderMenuNavigator = () => (
  <TopTab.Navigator swipeEnabled={false} tabBar={() => {}}>
    <TopTab.Screen name='Vendedores' component={SellersScreen} />
    <TopTab.Screen name='ProdutosPorVendedor' component={ProductsBySellerScreen} />
  </TopTab.Navigator>
);

export const SellersNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='FazerPedido' component={OrderMenuNavigator} />
  </Stack.Navigator>
);

import React from 'react';
import { LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthNavigator } from './auth.navigator';
import { ProductNavigator } from './product.navigator';
import { ProductsNavigator } from './products.navigator';
import { HomeBottomNavigation } from '../scenes/home/home-bottom-navigation.component';
import { HomeDrawer } from '../scenes/home/home-drawer.component';
import { ProfileNavigator } from './profile.navigator';
import { SellersNavigator } from './order.navigator';
import { CartNavigator } from './cart.navigator';
import { HistoryNavigator } from './history.navigator';

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const initialTabRoute = 'Home';

const ROOT_ROUTES = ['Home', 'Carrinho', 'Perfil', 'Histórico'];

const TabBarVisibilityOptions = ({ route }) => {
  const isNestedRoute = route.state?.index > 0;
  const isRootRoute = ROOT_ROUTES.includes(route.name);

  return { tabBarVisible: isRootRoute && !isNestedRoute };
};

const HomeTabsNavigator = () => (
  <BottomTab.Navigator
    screenOptions={TabBarVisibilityOptions}
    initialRouteName={initialTabRoute}
    tabBar={props => <HomeBottomNavigation {...props} />}>
    {/* <BottomTab.Screen name='Home' component={HomeScreenNavigator} /> */}
    <BottomTab.Screen name='Home' component={SellersNavigator} />
    <BottomTab.Screen name='Carrinho' component={CartNavigator} />
    <BottomTab.Screen name='Perfil' component={ProfileNavigator} />
    <BottomTab.Screen name='Histórico' component={HistoryNavigator} />
  </BottomTab.Navigator>
);

export const HomeNavigator = () => (
  <Drawer.Navigator
    screenOptions={{ gestureEnabled: true }}
    drawerContent={props => <HomeDrawer {...props} />}>
    <Drawer.Screen name='Home' component={HomeTabsNavigator} />
    <Drawer.Screen name='Auth' component={AuthNavigator} />
    <Drawer.Screen name='Product' component={ProductNavigator} />
    <Drawer.Screen name='Products' component={ProductsNavigator} />
  </Drawer.Navigator>
);

LogBox.ignoreLogs(['Accessing the \'state\'']);

import React from 'react';
import { LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// import { LayoutsNavigator } from './layouts.navigator';
// import { ComponentsNavigator } from './components.navigator';
import { AuthNavigator } from './auth.navigator';
import { HomeBottomNavigation } from '../scenes/home/home-bottom-navigation.component';
import { HomeDrawer } from '../scenes/home/home-drawer.component';
// import { LibrariesScreen } from '../scenes/libraries/libraries.component';

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const initialTabRoute = 'Home';

const ROOT_ROUTES = ['Home', 'Favoritos', 'Perfil', 'Histórico'];

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
    {/* <BottomTab.Screen name='Home' component={LayoutsNavigator} />
    <BottomTab.Screen name='Favoritos' component={LayoutsNavigator} /> */}
    <BottomTab.Screen name='Perfil' component={AuthNavigator} />
    {/* <BottomTab.Screen name='Histórico' component={ThemesNavigator} /> */}
  </BottomTab.Navigator>
);

export const HomeNavigator = () => (
  <Drawer.Navigator
    screenOptions={{ gestureEnabled: true }}
    drawerContent={props => <HomeDrawer {...props} />}>
    <Drawer.Screen name='Home' component={HomeTabsNavigator} />
    {/* <Drawer.Screen name='Libraries' component={LibrariesScreen} /> */}
  </Drawer.Navigator>
);

LogBox.ignoreLogs(['Accessing the \'state\'']);

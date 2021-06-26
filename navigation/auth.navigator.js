import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { AuthScreen } from '../screens/auth/auth.component';
import { AuthGridScreen } from '../screens/auth/auth-grid.component';
import { AuthListScreen } from '../screens/auth/auth-list.component';
import { SignIn2Screen } from '../screens/auth/sign-in-2.component';
import { SignUp2Screen } from '../screens/auth/sign-up-2.component';
import { ForgotPasswordScreen } from '../screens/auth/forgot-password.component';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const AuthMenuNavigator = () => (
	<TopTab.Navigator tabBar={(props) => <AuthScreen {...props} />}>
		<TopTab.Screen name='AuthGrid' component={AuthGridScreen} />
		<TopTab.Screen name='AuthList' component={AuthListScreen} />
	</TopTab.Navigator>
);

export const AuthNavigator = () => (
	<Stack.Navigator headerMode='none'>
		<Stack.Screen name='Auth' component={AuthMenuNavigator} />
		<Stack.Screen name='SignIn2' component={SignIn2Screen} />
		<Stack.Screen name='SignUp2' component={SignUp2Screen} />
		<Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
	</Stack.Navigator>
);

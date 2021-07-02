import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { AuthScreen } from '../scenes/auth/auth.component';
import { SignInScreen } from '../scenes/auth/sign-in.component';
import { SignUpScreen } from '../scenes/auth/sign-up.component';
// import { ForgotPasswordScreen } from '../scenes/auth/forgot-password.component';

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const AuthMenuNavigator = () => (
	<TopTab.Navigator tabBar={(props) => <AuthScreen {...props} />}>
		<TopTab.Screen name='Login' component={SignInScreen} />
		<TopTab.Screen name='Cadastro' component={SignUpScreen} />
	</TopTab.Navigator>
);

export const AuthNavigator = () => (
	<Stack.Navigator headerMode='none'>
		<Stack.Screen name='Auth' component={AuthMenuNavigator} />
		{/* <Stack.Screen name='SignIn' component={SignInScreen} />
		<Stack.Screen name='SignUp' component={SignUpScreen} /> */}
		{/* <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}
	</Stack.Navigator>
);

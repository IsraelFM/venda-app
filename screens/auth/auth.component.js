import React from 'react';
import { Tab, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { BrandTabBar } from '../../components/brand-tab-bar.component';
import { ArrowIosBackIcon, GridIcon, ListIcon } from '../../components/icons';

export const AuthScreen = ({ navigation, state }) => {

	const onTabSelect = (index) => {
		navigation.navigate(state.routeNames[index]);
	};

	const renderBackAction = () => (
		<TopNavigationAction
			icon={ArrowIosBackIcon}
			onPress={navigation.goBack}
		/>
	);

	return (
		<SafeAreaLayout insets='top'>
			<TopNavigation
				title='Auth'
				accessoryLeft={renderBackAction}
			/>
			<BrandTabBar
				selectedIndex={state.index}
				onSelect={onTabSelect}>
				<Tab icon={GridIcon} />
				<Tab icon={ListIcon} />
			</BrandTabBar>
		</SafeAreaLayout>
	);
};

import React from 'react';
import { StyleSheet } from 'react-native';
import {
	ApplicationProvider,
	Button,
	Icon,
	IconRegistry,
	Layout,
	Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

import { default as theme } from './theme.json';
import { default as mapping } from './mapping.json';

const HeartIcon = (props) => (
	<Icon {...props} name='heart' />
);

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider
			{...eva}
			theme={{ ...eva.light, ...theme }}
			customMapping={mapping}
		>
			<Layout style={styles.container}>
			</Layout>
		</ApplicationProvider>
	</>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		textAlign: 'center',
	},
	likeButton: {
		marginVertical: 16,
	},
});

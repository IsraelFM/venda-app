import React from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import FlashMessage from "react-native-flash-message";

import { AppNavigator } from '../../navigation/app.navigator';

import { default as theme } from '../../../theme.json';

const App = () => {
	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<AppearanceProvider>
				<ApplicationProvider
          {...eva}
          theme={{ ...eva.light, ...theme }}
          // customMapping={mapping}
        >
          <SafeAreaProvider>
            <FlashMessage position="top" />
            <StatusBar />
            <AppNavigator />
          </SafeAreaProvider>
				</ApplicationProvider>
			</AppearanceProvider>
		</>
	);
};

export default App;

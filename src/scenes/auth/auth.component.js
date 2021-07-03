import React from 'react';
import { Image, View } from 'react-native';
import { Tab, TabBar } from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';

export const AuthScreen = ({ navigation, state }) => {

  const onTabSelect = (index) => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <SafeAreaLayout insets='top'>
      <View 
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'color-primary-default'
        }}
      >
        <Image
          style={{ height: 200, width: 200 }}
          source={require('../../assets/images/logo.png')}
        />
      </View>

      <TabBar
        indicatorStyle={{
          borderColor: '#FFF',
          borderWidth: 2
        }}
        style={{height: 40}}
        selectedIndex={state.index}
        onSelect={onTabSelect}
      >
        <Tab title='Login' />
        <Tab title='Cadastro' />
      </TabBar>
    </SafeAreaLayout>
  );
};

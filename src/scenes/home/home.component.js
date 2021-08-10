import React from 'react';
import { Image, View } from 'react-native';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';

export const HomeScreen = ({ navigation }) => {

  return (
    <SafeAreaLayout insets='top'>
      <View 
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#D7085A'
        }}
      >
        <Image
          style={{ height: 200, width: 200 }}
          source={require('../../assets/images/logo.png')}
        />
      </View>
    </SafeAreaLayout>
  );
};

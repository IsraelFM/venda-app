import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerItem,
  Layout,
  Text,
} from '@ui-kitten/components';

import { GithubIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { WebBrowserService } from '../../services/web-browser.service';
import { AppInfoService } from '../../services/app-info.service';
import { PersonIcon } from '../../layouts/auth/extra/icons';

const version = AppInfoService.getVersion();

export const HomeDrawer = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const DATA = [
    {
      title: 'Apoie este Projeto',
      icon: GithubIcon,
      onPress: () => {
        WebBrowserService.openBrowserAsync('https://github.com/IsraelFM/vendas-app');
        navigation.toggleDrawer();
      },
    },
    {
      title: 'Entrar',
      icon: PersonIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Auth');
      },
    },  
    {
      title: 'Produtos',
      icon: PersonIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Products');
      },
    },  
    {
      title: 'Cadastrar Produtos',
      icon: PersonIcon,
      onPress: () => {
        navigation.toggleDrawer();
        navigation.navigate('Product');
      },
    },  
  ];

  const renderHeader = () => (
    <SafeAreaLayout insets='top' level='2'>
      <Layout style={styles.header} level='2'>
        <View style={styles.profileContainer}>
          <Avatar
            size='giant'
            style={{ height: 100, width:100 }}
            source={require('../../assets/images/logo.png')}
          />
          <Text style={styles.profileName} category='h6'>
          </Text>
        </View>
      </Layout>
    </SafeAreaLayout>
  );

  const renderFooter = () => (
    <SafeAreaLayout insets='bottom'>
      <>
        <Divider />
        <View style={styles.footer}>
          <Text style={styles.footerText}>{`Version ${version}`}</Text>
        </View>
      </>
    </SafeAreaLayout>
  );

  return (
    <Drawer
      header={renderHeader}
      footer={renderFooter}
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      {DATA.map((el, index) => (
        <DrawerItem
          key={index}
          title={el.title}
          onPress={el.onPress}
          accessoryLeft={el.icon}
        />
      ))}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#B1B1B1'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 16,
  },
});

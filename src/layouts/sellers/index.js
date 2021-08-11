import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import {
  Divider,
  List,
  ListItem,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  Button,
  Card,
  Text,
  Layout,
  Input,
  Icon
} from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { searchOutlineIcon } from './extra/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
// import {  } from '../../firebase/users';

export default ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        // style={{backgroundColor: '#000'}}
        accessoryLeft={renderDrawerAction}
      />
      <Divider />

      <Layout style={styles.formContainer} level='1'>
        <Text style={styles.attentionText} >
          Diversas opções{'\n'}para você
        </Text>
        <Input
          placeholder={'Pesquise aqui um vendedor (nome)'}
          style={styles.inputSearch}
          textStyle={styles.inputSearchText}
          accessoryLeft={searchOutlineIcon}
        />

        <View style={styles.helpContainer}>
          <Icon
            fill='#FD877A'
            style={styles.helpIcon}
            name='question-mark-circle-outline'
          />
          <Text style={styles.helpText} >
            Escolha um VENDEDOR na lista abaixo para visualizar os produtos que eles oferecem
          </Text>
        </View>

        <KeyboardAvoidingView>
          <ScrollView horizontal={true} >
            <View style={styles.viewSellerContainer} >
              <Card style={styles.cardSellerContainer}>
                <Image
                  resizeMode={'stretch'}
                  style={styles.cardSellerImage}
                  source={{
                    uri: 'https://blog.b2wmarketplace.com.br/wp-content/uploads/2017/11/Blog_Imagem-Principal_O-que-e-seller.png',
                  }}
                />
                <Text
                  numberOfLines={3}
                  style={styles.cardSellerName}
                >
                  Cantina da Dona Silvia
                </Text>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </Layout>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'color-success-400',
  },
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: 'color-success-400',
  },
  attentionText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputSearch: {
    borderRadius: 20,
  },
  inputSearchText: {
    height: 50,
    fontSize: 18,
  },

  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  helpIcon: {
    width: 32,
    height: 32,
    marginVertical: 20,
  },
  helpText: {
    fontStyle: 'italic',
    fontSize: 15,
    marginVertical: 20,
    width: 300,
    textAlign: 'center',
    color: '#FD877A'
  },

  viewSellerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardSellerContainer: {
    borderRadius: 20,
    backgroundColor: '#D7085A',
    width: 200,
    height: 200,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#D7085A',
    elevation: 10,
  },
  cardSellerImage: {
    marginTop: -20,
    marginHorizontal: -25,
    height: 120,
  },
  cardSellerName: {
    marginVertical: 5,
    height: 75,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
  }
});

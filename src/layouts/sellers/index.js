import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import {
  Divider,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  Card,
  Text,
  Layout,
  Input,
  Icon
} from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { searchOutlineIcon } from './extra/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
import { getAllSellers } from '../../firebase/users';

export default ({ navigation }) => {
  const [afterProccess, setAfterProccess] = React.useState(1);
  const [sellers, setSellers] = React.useState([]);

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  const buildSellersComponent = ({ sellers }) => {
    const sellersHidded = sellers.filter(seller => !!seller.hide);
    if (sellers.length === sellersHidded.length) return buildEmptyStateComponent({ emptyText: 'Puxa... infelizmente ainda não há vendedores cadastrados com esse nome' });

    return (
      <KeyboardAvoidingView>
        <ScrollView horizontal={true} >
          {sellers.map((seller, key) => (
            <View key={key} style={[styles.viewSellerContainer, seller.hide ? { display: 'none' } : {}]} >
              <Card style={styles.cardSellerContainer}>
                <Image
                  resizeMode={'stretch'}
                  style={styles.cardSellerImage}
                  source={{
                    uri: seller.uri || 'https://blog.b2wmarketplace.com.br/wp-content/uploads/2017/11/Blog_Imagem-Principal_O-que-e-seller.png',
                  }}
                />
                <Text
                  numberOfLines={3}
                  style={styles.cardSellerName}
                >
                  {seller.username}
                </Text>
              </Card>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  };

  const buildEmptyStateComponent = ({ emptyText } = {}) => (
    <View style={styles.emptyStateContainer} >
      <Icon
        fill='#FD877A'
        style={styles.helpIcon}
        name='alert-circle-outline'
      />
      <Text style={styles.emptyStateText} >
        {emptyText ? emptyText : 'Puxa... infelizmente ainda não há vendedores cadastrados'}
      </Text>
    </View>
  );

  navigation.addListener('focus', async () => {
    const getAllSellersResponse = await getAllSellers();
    let temp = [];

    if (!getAllSellersResponse.error) {
      if (!getAllSellersResponse.empty) {
        getAllSellersResponse.forEach(seller => temp.push(seller.data()));
      }

      setSellers(temp);
    } else {
      showMessage({
        message: 'Ops...',
        description: getAllSellersResponse.error,
        type: 'danger',
        duration: 3000,
        floating: true
      });
    }
  });

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
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
          onChangeText={text => {
            sellers.forEach(seller => seller.hide = seller.username.toUpperCase().indexOf(text.toUpperCase()) !== -1 ? false : true);
            setAfterProccess(afterProccess + 1);
          }}
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

        {sellers.length == 0
          ? (!afterProccess && buildEmptyStateComponent())
          : (!afterProccess && buildSellersComponent({ sellers }))
        }

        {afterProccess && buildSellersComponent({ sellers })}
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
    alignSelf: 'center',
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

  emptyStateContainer: {
    borderRadius: 10,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#FD877A',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 50,
    width: '100%',
    height: 300,
  },
  emptyStateText: {
    color: '#FD877A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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

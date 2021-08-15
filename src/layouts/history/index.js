import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  Button,
  Icon,
  Layout,
  Spinner,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet
} from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';

import { getOrders } from '../../firebase/orders';
import { getCurrentUserDocument, userIsLogged, userType } from '../../firebase/users';
import { LogInOutlineIcon } from '../auth/extra/icons';
import { PersonAddOutlineIcon } from '../profile/extra/icons';

export default ({ navigation }) => {
  const paymentMethod = {
    'credit-card': 'Cartão de crédito/débito',
    'money': 'Em espécie',
  };

  const deliveryMethod = {
    'delivery': 'Residência',
    'withdrawal': 'Retirar com vendedor',
  };

  const addZero = (num) => (num <= 9 ? '0' + num : num);
  const formatDate = (date) => {
    return (addZero(date.getDate().toString()) + '/' + (addZero(date.getMonth() + 1).toString()) + '/' + date.getFullYear() + ' às ' + date.toLocaleTimeString('pt-BR'));
  }

  const [typeOfUser, setTypeOfUser] = React.useState(null);
  const [orders, setOrders] = React.useState(null);

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  const renderHeaderText = () => (
    <Text style={styles.headerText}>
      HISTÓRICO
    </Text>
  );

  const buildLoadingComponent = () => {
    if (!userIsLogged()) {
      return (<View style={styles.authButtonsContainer} >
        <Button
          style={styles.authButtons}
          onPress={() => navigation.navigate('Auth')}
          size='giant'
          accessoryLeft={LogInOutlineIcon}
          accessoryRight={PersonAddOutlineIcon}
        >
          Clique aqui para realizar o{'\n'} LOGIN / CADASTRO
        </Button>
      </View>)
    } else {
      return (<View style={styles.loadingContainer} >
        <Spinner size='giant' />
        <Text status='danger' style={styles.loadingText} >
          Buscando histórico...
        </Text>
      </View>)
    }
  };

  const buildEmptyStateComponent = () => (
    <View style={styles.emptyStateContainer} >
      <Icon
        fill='#FD6C7B'
        style={styles.helpIcon}
        name='alert-circle-outline'
      />
      <Text style={styles.emptyStateText} >
        Não há pedidos no histórico
      </Text>
    </View>
  );

  const buildOrdersComponent = () => {
    return (
      <ScrollView>
        {orders.map((order, key) => (
          <View key={key} style={styles.orderContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                {typeOfUser === 'seller' ? 'Comprador:' : 'Vendedor:'}
              </Text>
              <Text style={styles.textContainerValue}>
                {order[(typeOfUser === 'seller' ? 'buyerName' : 'sellerName')]}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                Data do Pedido:
              </Text>
              <Text style={styles.textContainerValue}>
                {formatDate(order.date.toDate())}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                Entrega:
              </Text>
              <Text style={styles.textContainerValue}>
                {deliveryMethod[order.deliveryMethod]}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                Pagamento:
              </Text>
              <Text style={styles.textContainerValue}>
                {paymentMethod[order.paymentMethod]}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                Produtos:
              </Text>
              <Text style={styles.textContainerValue}>
                {order.products.map((product, key) =>
      `➜ ${product.name}\n\t\t\tQuantidade: ${product.quantity}\n\t\t\tPreço unitário: R$ ${product.unitPrice}${key === order.products.length-1 ? '' : '\n'}`)}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>
                Preço Total:
              </Text>
              <Text style={styles.textContainerValue}>
                R$ {order.totalPrice}
              </Text>
            </View>

          </View>
        ))}
      </ScrollView>
    );
  };

  navigation.addListener('focus', async () => {
    setOrders(null);
    if (!userIsLogged()) return;

    const getOrdersResponse = await getOrders();
    const type = await userType();
    let temp = [];

    setTypeOfUser(type);

    if (!getOrdersResponse.error) {
      if (!getOrdersResponse.empty) {

        getOrdersResponse.forEach(order => {
          const tempOrder = order.data();
          tempOrder.personName = 'sas';
          // tempOrder.personName = (await getCurrentUserDocument({
          //   uid: tempOrder[`)}Id`]
          // })).username;
          temp.push(tempOrder);

        });
      } else {
      }
      setOrders(temp);
    } else {
      showMessage({
        message: 'Ops...',
        description: getOrdersResponse.error,
        type: 'danger',
        duration: 3000,
        floating: true
      });
    }
  });

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'
    >
      <TopNavigation
        title={renderHeaderText}
        alignment='center'
        style={{ backgroundColor: '#EEE' }}
        accessoryLeft={renderDrawerAction}
      />

      <Layout style={styles.formContainer} level='1'>
        {!orders
          ? buildLoadingComponent()
          : (Object.values(orders).length === 0)
            ? buildEmptyStateComponent()
            : buildOrdersComponent()
        }
      </Layout>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'color-success-400',
  },
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: 'color-success-400',
  },

  orderContainer: {
    flexDirection: 'column',
    backgroundColor: '#D7085A',
    padding: 10,
    marginVertical: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginVertical: 5,
  },
  textTitle: {
    fontSize: 20,
    color: 'white',
    marginRight: 10,
  },
  textContainerValue: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loadingText: {
    marginVertical: 20,
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },

  emptyStateContainer: {
    flex: 1,
    borderColor: '#FD6C7B',
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 50,
  },
  helpIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  emptyStateText: {
    color: '#FD6C7B',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  authButtonsContainer: {
    flex: 1,
    height: '100%',
    marginHorizontal: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtons: {
    width: '100%',
    marginVertical: 10,
  },
});

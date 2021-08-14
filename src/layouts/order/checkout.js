import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Layout,
  Radio,
  RadioGroup,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet
} from '@ui-kitten/components';

import { ArrowIosBackIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { createOrder } from '../../firebase/orders';
import { showMessage } from 'react-native-flash-message';


export default ({ navigation, route }) => {
  const delivery = ['delivery', 'withdrawal'];
  const [selectedDeliveryIndex, setSelectedDeliveryIndex] = React.useState(0);
  const payment = ['money', 'credit-card'];
  const [selectedPaymentIndex, setSelectedPaymentIndex] = React.useState(0);

  const { sellerId, totalPrice, products } = route?.params || {};
  console.log({ sellerId, totalPrice, products })

  const styles = useStyleSheet(themedStyles);

  const renderGoBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={() => navigation.canGoBack() && navigation.goBack()}
    />
  );

  const renderHeaderText = () => (
    <Text style={styles.headerText}>
      FINALIZAÇÃO
    </Text>
  );

  const createOrderAction = async () => {
    const createOrderResponse = await createOrder({
      paymentMethod: payment[selectedPaymentIndex],
      deliveryMethod: delivery[selectedDeliveryIndex],
      products,
      sellerId,
      totalPrice,
    });

    if (createOrderResponse.error) {
      showMessage({
        message: 'Ops...',
        description: createOrderResponse.error,
        type: 'danger',
        floating: true,
        duration: 4000,
      });
    } else {
      showMessage({
        message: createOrderResponse.success,
        type: 'success',
        floating: true,
        duration: 2000,
      });
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
    // navigation.navigate
  };

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'
    >
      <TopNavigation
        title={renderHeaderText}
        alignment='center'
        style={{ backgroundColor: '#EEE' }}
        accessoryLeft={renderGoBackAction}
      />

      <Layout style={styles.formContainer} level='1'>
        <View style={styles.controlContainer}>
          <Text style={styles.answerTitle}>
            O que você prefere?
          </Text>
          <RadioGroup
            selectedIndex={selectedDeliveryIndex}
            onChange={index => setSelectedDeliveryIndex(index)}>
            <Radio>
              <Text style={styles.answerResponse}>
                Gostaria de receber o pedido em casa
              </Text>
            </Radio>
            <Radio>
              <Text style={styles.answerResponse}>
                Eu vou buscar o pedido
              </Text>
            </Radio>
          </RadioGroup>

          <Text style={styles.answerTitle}>
            Como irá pagar?
          </Text>
          <RadioGroup
            selectedIndex={selectedPaymentIndex}
            onChange={index => setSelectedPaymentIndex(index)}>
            <Radio>
              <Text style={styles.answerResponse}>
                Com dinheiro vivo
              </Text>
            </Radio>
            <Radio>
              <Text style={styles.answerResponse}>
                Com cartão de crédito/débito
              </Text>
            </Radio>
          </RadioGroup>

          <Text style={styles.answerTitle}>
            Preço Total
          </Text>
          <Text style={styles.answerResponse}>
            R$ {totalPrice}
          </Text>
        </View>

      </Layout>
      <Button
        style={styles.checkoutButton}
        status={'danger'}
        size='giant'
        onPress={createOrderAction}
      >
        ENVIAR PEDIDO
      </Button>

    </SafeAreaLayout>
  )
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
  controlContainer: {
    marginVertical: 40,
    // flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
  },

  answerTitle: {
    marginTop: 40,
    fontWeight: 'bold',
    fontSize: 30,
  },
  answerResponse: {
    fontSize: 20,
  },

  checkoutButton: {
    backgroundColor: '#FD6C7B',
    margin: 10,
    fontSize: 20,
    padding: 20,
  },

});

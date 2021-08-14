import React from 'react';
import { Image, ScrollView, View } from 'react-native';

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
import { SafeAreaLayout } from '../../components/safe-area-layout.component';

import { deleteProductFromCart, getCartFromCurrentUser, updateQuantityProductCart } from '../../firebase/orders';
import { CloseIcon, MenuIcon } from '../../components/icons';
import { minusIcon, moreHorizontalIconOutline, plusIcon } from './extra/icons';
import { showMessage } from 'react-native-flash-message';

export default ({ navigation }) => {
  const [cart, setCart] = React.useState(null);

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  const renderOptionsAction = () => (
    <TopNavigationAction
      icon={moreHorizontalIconOutline}
      onPress={navigation.toggleDrawer}//Abrir "modal" com um botão apenas para limpar tudo
    />
  );

  const renderHeaderText = () => (
    <Text style={styles.headerText}>
      CARRINHO
    </Text>
  );

  const buildLoadingComponent = () => (
    <View style={styles.loadingContainer} >
      <Spinner size='giant' />
      <Text status='danger' style={styles.loadingText} >
        Buscando itens do carrinho...
      </Text>
    </View>
  );

  const buildEmptyStateComponent = () => (
    <View style={styles.emptyStateContainer} >
      <Icon
        fill='#FD6C7B'
        style={styles.helpIcon}
        name='alert-circle-outline'
      />
      <Text style={styles.emptyStateText} >
        Seu carrinho está vazio
      </Text>
    </View>
  );

  const buildCartComponent = ({ cart }) => (
    <ScrollView>
      {cart.products.map((product, key) => (
        <View style={styles.cardCartContainer} key={key}>
          <Image
            style={styles.image}
            source={{ uri: product.uri }}
          />
          <View style={styles.detailsContainer}>
            <Text category='h5' style={styles.cardCartName} >
              {product.name}
            </Text>
            <Text category='s2'>
              R$ {product.unitPrice} / unidade
            </Text>

            <View style={styles.amountContainer}>
              <Button
                style={[styles.iconButton, styles.amountButton]}
                size='small'
                accessoryLeft={minusIcon}
                onPress={() => { quantityProductPress({ operation: -1, productName: product.name }) }}
                disabled={!(product.quantity > 1)}
              />
              <Text
                style={styles.amount}
                category='s2'>
                {`${product.quantity}`}
              </Text>
              <Button
                style={[styles.iconButton, styles.amountButton]}
                size='small'
                accessoryLeft={plusIcon}
                onPress={() => { quantityProductPress({ operation: +1, productName: product.name }) }}
              />
            </View>
            <Button
              style={[styles.iconButton, styles.removeButton]}
              appearance='ghost'
              status='basic'
              size={'large'}
              accessoryLeft={CloseIcon}
              onPress={() => { onRemoveButtonPress({ productName: product.name }) }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const onRemoveButtonPress = async ({ productName }) => {
    const updateCartResponse = await deleteProductFromCart({
      productName,
    });

    if (updateCartResponse.error) {
      showMessage({
        message: 'Ops...',
        description: updateCartResponse.error,
        type: 'danger',
        floating: true,
        duration: 4000,
      });
    } else {
      setCart(updateCartResponse.cart);
    }
  };

  const quantityProductPress = async ({ operation, productName }) => {
    const updateCartResponse = await updateQuantityProductCart({
      productName,
      operation
    });

    if (updateCartResponse.error) {
      showMessage({
        message: 'Ops...',
        description: updateCartResponse.error,
        type: 'danger',
        floating: true,
        duration: 4000,
      });
    } else {
      setCart(updateCartResponse.cart);
    }
  };

  navigation.addListener('focus', async () => {
    const getCartResponse = await getCartFromCurrentUser();

    if (!getCartResponse.error) {
      setCart(getCartResponse);
    } else {
      showMessage({
        message: 'Ops...',
        description: getCartResponse.error,
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
        accessoryRight={renderOptionsAction}
      />

      {!cart
        ? buildLoadingComponent()
        : (Object.values(cart).length === 0)
          ? buildEmptyStateComponent()
          : (
            <>
              <Layout style={styles.formContainer} level='1'>
                {buildCartComponent({ cart })}
              </Layout>
              <View style={styles.totalPriceContainer}>
                <View>
                  <Text style={styles.totalPriceTitle}>
                    Preço Total
                  </Text>
                  <Text style={styles.totalPriceValue}>
                    R$ {cart.totalPrice}
                  </Text>
                </View>
                <Button
                  style={styles.checkoutButton}
                  status={'control'}
                  size='giant'
                  onPress={() => {
                    navigation.navigate('FecharPedido', {
                      screen: 'Checkout',
                      params: cart,
                    });
                  }}
                >
                  CONTINUAR
                </Button>
              </View>
            </>
          )}
      {/* Botão para esvaziar carrinho */}
      {/* <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance='ghost'
        status='basic'
        accessoryLeft={CloseIcon}
        onPress={onRemoveButtonPress}
      /> */}
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'color-success-400',
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

  cardCartContainer: {
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  cardCartName: {
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  image: {
    width: 120,
    height: 144,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  amountContainer: {
    position: 'absolute',
    flexDirection: 'row',
    left: 16,
    bottom: 16,
  },
  amountButton: {
    borderRadius: 40,
  },
  amount: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 40,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
  },

  totalPriceContainer: {
    backgroundColor: '#FD6C7B',
    fontSize: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
  },
  totalPriceTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right'
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
});

import React from 'react';
import { BackHandler, Dimensions, Image, ScrollView, TouchableHighlight, View } from 'react-native';
import {
  Button,
  Card,
  Divider,
  Layout,
  Modal,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet
} from '@ui-kitten/components';

import { ArrowIosBackIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { cubeIconOutline, personIconOutline, pricetagsIconOutline, shoppingCartIconOutline } from './extra/icons';
import { showMessage } from 'react-native-flash-message';

import { addToCart } from '../../firebase/orders';
import { userType } from '../../firebase/users';

export default ({ navigation, route }) => {
  const [typeOfUser, setTypeOfUser] = React.useState('buyer');
  const [visible, setVisible] = React.useState(false);
  const [modalProduct, setModalProduct] = React.useState({});
  const windowWidth = Dimensions.get('window').width;

  const { sellerId, sellerName, sellerImage } = route?.params || {};
  const products = Object.values(route?.params?.products || []);

  const styles = useStyleSheet(themedStyles);

  const renderGoBackAction = () => (
    <TopNavigationAction
      icon={ArrowIosBackIcon}
      onPress={() => navigation.canGoBack() && navigation.goBack()}
    />
  );

  const renderHeaderText = () => (
    <Text style={styles.headerText}>
      PRODUTOS
    </Text>
  );

  const renderModal = () => (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}
    >
      <Card
        style={{ width: windowWidth - 50 }}
        disabled={true}
      >
        {!modalProduct.uri
          ? cubeIconOutline({ fill: '#EEE', style: { ...styles.cardProductImage, ...{ height: 200 } } })
          : (<Image
            resizeMode={'stretch'}
            style={styles.cardProductImage}
            height={400}
            source={{ uri: modalProduct.uri }}
          />)
        }

        <Divider style={styles.cardDividerProductContent} />

        <Text
          numberOfLines={1}
          style={styles.cardProductName}
        >
          {modalProduct.name}
        </Text>
        <View style={[styles.cardProductDescription, { maxHeight: 130, marginBottom: 20 }]}>
          <ScrollView>
            <Text>
              {modalProduct.description}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.cardProductPriceContainer} >
          {pricetagsIconOutline({ fill: '#D7085A', style: { height: 20, width: 20 } })}
          <Text style={styles.cardPriceText} >
            R$ {modalProduct.price}
          </Text>
        </View>

        <View style={styles.modalButtonsContainer} >
          <Button
            appearance='ghost'
            size={'medium'}
            status={'basic'}
            onPress={() => setVisible(false)}
          >
            Ver outros
          </Button>
          {typeOfUser !== 'seller'
            ?
            (<Button
              accessoryLeft={shoppingCartIconOutline}
              size={'large'}
              onPress={addOneToCart}
            >
              ADICIONAR +1
            </Button>)
            : (<></>)
          }
        </View>
      </Card>
    </Modal>
  );

  const addOneToCart = async ({ product = {} } = {}) => {
    const addToCartResponse = await addToCart({
      sellerId,
      sellerName,
      newProduct: {
        name: product.name || modalProduct.name,
        uri: product.uri || modalProduct.uri,
        unitPrice: product.price || modalProduct.price,
        quantity: 1,
      }
    });

    if (addToCartResponse.error) {
      showMessage({
        message: 'Ops...',
        description: addToCartResponse.error,
        type: 'danger',
        floating: true,
        duration: 4000,
      });
    } else {
      showMessage({
        message: addToCartResponse.success,
        type: 'success',
        floating: true,
        duration: 1500,
      });
    }

    setVisible(false)
  };

  BackHandler.addEventListener('hardwareBackPress', function () {
    if (visible) {
      setVisible(false);
      return true;
    }

    navigation.goBack();
  });

  navigation.addListener('focus', async () => {
    setTypeOfUser(await userType());
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
        accessoryLeft={renderGoBackAction}
      />

      <Layout style={styles.formContainer} level='1'>
        <View style={styles.sellerContainer}>
          {!sellerImage
            ? personIconOutline({ fill: '#EEE', style: { height: 120, width: 150 } })
            : (<Image
              resizeMode={'cover'}
              style={styles.sellerImage}
              source={{ uri: sellerImage }}
            />)
          }
          <View style={styles.sellerTextualContainer} >
            <Text style={styles.sellerHeaderTextual}>
              Vendedor
            </Text>
            <Text
              numberOfLines={3}
              style={styles.sellerNameTextual}
            >
              {sellerName}
            </Text>
          </View>
        </View>

        <Divider style={styles.dividerBetweenSellerProducts} />

        <ScrollView>
          <View style={styles.flexboxProductContainer}>
            {products.map((product, key) => (
              <Card key={key} style={styles.cardProductContainer}>
                {typeOfUser !== 'seller'
                  ?
                  (<Button
                    style={styles.cardCartButtonProductContainer}
                    accessoryLeft={shoppingCartIconOutline}
                    size={'small'}
                    onPress={() => { addOneToCart({ product }); }}
                  >
                    <Text style={styles.cardCartTextProduct} >
                      +1
                    </Text>
                  </Button>)
                  :
                  (<></>)
                }

                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    setModalProduct(product);
                    setVisible(true)
                  }}
                >
                  <View>
                    {!product.uri
                      ? cubeIconOutline({ fill: '#EEE', style: { ...styles.cardProductImage, ...{ height: 120, width: 180 } } })
                      : (<Image
                        resizeMode={'stretch'}
                        style={styles.cardProductImage}
                        height={120}
                        width={180}
                        source={{ uri: product.uri }}
                      />)
                    }

                    <Divider style={styles.cardDividerProductContent} />

                    <Text
                      numberOfLines={1}
                      style={styles.cardProductName}
                    >
                      {product.name}
                    </Text>
                    <Text
                      numberOfLines={6}
                      style={[styles.cardProductDescription, { height: 100 }]}
                    >
                      {product.description}
                    </Text>

                    <View style={styles.cardProductPriceContainer} >
                      {pricetagsIconOutline({ fill: '#D7085A', style: { height: 20, width: 20 } })}
                      <Text style={styles.cardPriceText} >
                        R$ {product.price}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </Card>
            ))}
          </View>
        </ScrollView>
      </Layout>

      {renderModal()}
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

  sellerContainer: {
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    backgroundColor: '#D7085A',
    marginHorizontal: 20,
  },
  sellerImage: {
    height: 120,
    width: 150,
    borderColor: '#D7085A',
    borderWidth: 5,
    borderRadius: 20,
  },
  sellerTextualContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sellerHeaderTextual: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D7085A',
    backgroundColor: '#EEE',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sellerNameTextual: {
    margin: 8,
    fontSize: 21,
    flex: 1,
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: 'white',
  },

  dividerBetweenSellerProducts: {
    backgroundColor: '#D7085A',
    height: 5,
    borderRadius: 10,
    marginTop: 10
  },

  flexboxProductContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  cardCartButtonProductContainer: {
    paddingHorizontal: 0,
    borderRadius: 20,
    borderColor: '#E5E5E5',
    borderWidth: 4,
    position: 'absolute',
    right: -1,
    top: -1,
    zIndex: 90000,
  },
  cardCartTextProduct: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardProductContainer: {
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
    width: 180,
    height: 300,
    marginVertical: 10,
  },
  cardDividerProductContent: {
    backgroundColor: '#E5E5E5',
    height: 5,
    marginHorizontal: -25,
  },
  cardProductImage: {
    marginTop: -20,
    marginHorizontal: -24,
    height: 10,
  },
  cardProductName: {
    marginVertical: 5,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cardProductDescription: {
    marginVertical: 5,
    fontSize: 15,
  },
  cardProductPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cardPriceText: {
    color: '#D7085A',
    fontSize: 15,
    fontWeight: 'bold',
  },

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20
  },
});

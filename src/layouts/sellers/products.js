import React from 'react';
import { Image, ScrollView, TouchableHighlight, View } from 'react-native';
import {
  Card,
  Divider,
  Layout,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet
} from '@ui-kitten/components';

import { ArrowIosBackIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { cubeIconOutline, personIconOutline, pricetagsIconOutline } from './extra/icons';

export default ({ navigation, route }) => {
  const { sellerName, sellerImage } = route?.params || {};
  const products = Object.values(route?.params?.products || []);

  // const [productsList, setProductsList] = React.useState(false);
  console.log('______', products);

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
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

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={renderHeaderText}
        alignment='center'
        style={{ backgroundColor: '#EEE' }}
        accessoryLeft={renderDrawerAction}
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
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => { console.log('AO CLICAR AQUI ABRIR MODAL PARA INFORMAR A QUANTIDADE') }}
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
                      style={styles.cardProductDescription}
                    >
                      {product.description}
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }} >
                      {pricetagsIconOutline({ fill: '#D7085A', style: { height: 20, width: 20 } })}
                      <Text style={{
                        color: '#D7085A',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }} >
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
    height: 100,
    fontSize: 15,
  },
});

import React from 'react';
import { View, Image } from 'react-native';
import {
  Divider,
  List,
  ListItem,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  Button,
  Modal,
  Card,
  Text,
  Icon
} from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { getCurrentUserDocument, deleteUserProduct, userType } from '../../firebase/users';

export default ({ navigation }) => {
  const [typeOfUser, setTypeOfUser] = React.useState('buyer');
  const [rawProducts, setRawProducts] = React.useState(null)
  const [products, setProducts] = React.useState([])
  const [visible, setVisible] = React.useState(false);
  const [showProduct, setShowProduct] = React.useState({
    name: '',
    description: '',
    uri: '',
    image: '',
    price: ''
  })

  React.useEffect(async () => {
    const user = await getCurrentUserDocument()
    setRawProducts(user.products)
    await makeProducts()
  }, [rawProducts])

  const ListDividersShowcase = () => {
    const styles = useStyleSheet(themedStyles);
    const renderItem = ({ item, index }) => (
      <ListItem
        title={`${item.name}`}
        description={`${item.description}`}
        onPress={() => {
          setShowProduct(item)
          setVisible(true)
        }}
      />
    );

    return (
      <List
        style={styles.listContainer}
        data={products}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    );
  };

  const makeProducts = async () => {
    if (rawProducts)
      setProducts(Object.values(rawProducts))
  }

  const styles = useStyleSheet(themedStyles);

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  const buildEmptyStateComponent = () => (
    <View style={styles.emptyStateContainer} >
      <Icon
        fill='#FD6C7B'
        style={styles.helpIcon}
        name='alert-circle-outline'
      />
      <Text style={styles.emptyStateText} >
        Se quiser CADASTRAR PRODUTOS, entre em contato com o suporte e solicite uma conta de  VENDEDOR
      </Text>
    </View>
  );

  navigation.addListener('focus', async () => {
    setTypeOfUser(await userType());
  })

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='Lista de Produtos'
        accessoryLeft={renderDrawerAction}
      />
      <Divider />
      {typeOfUser === 'seller'
        ? (
          <>
            {ListDividersShowcase()}
            <Modal
              visible={visible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => setVisible(false)}>
              <Card disabled={true}>
                <Text
                  style={styles.productName}
                >{showProduct.name || 'teste'}</Text>
                <View>
                  <Image
                    style={styles.imgCard}
                    source={{
                      uri: `${showProduct.uri}`
                    }}
                  />
                </View>
                <Text
                  style={styles.productDescription}
                >{showProduct.description}</Text>
                <Text
                  style={styles.productDescription}
                >{`Preço R$ ${showProduct.price}`}</Text>
                <Button
                  style={styles.backButton}
                  onPress={() => setVisible(false)}>
                  Voltar
                </Button>
                <Button onPress={async () => {
                  await deleteUserProduct({ toDelete: showProduct.name })
                  setVisible(false)
                }}>
                  Deletar
                </Button>
              </Card>
            </Modal>
          </>)
        : buildEmptyStateComponent()}
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
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: 'color-success-400',
  },
  emailInput: {
    marginTop: 16,
  },
  editButton: {
    borderRadius: 50,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  errorInput: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'color-danger-600',
  },
  imgCard: {
    width: 350,
    height: 350,
  },
  productName: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 28,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    marginBottom: 10,
    backgroundColor: 'color-info-600'
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

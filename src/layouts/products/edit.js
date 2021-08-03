import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback, ScrollView, SafeAreaView } from 'react-native';
import {
  Divider,
  List,
  ListItem,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { getCurrentUserDocument, updateCurrentUserDocument, deleteUserProduct } from '../../firebase/users';

export default ({ navigation }) => {
  const [rawProducts, setRawProducts] = React.useState(null)
  const [products, setProducts] = React.useState([])

  React.useEffect(async () => {
    const user = await getCurrentUserDocument()
    console.log(user)
    setRawProducts(user.products)
    await makeProducts()
  }, [rawProducts])

  const ListDividersShowcase = () => {
    const styles = useStyleSheet(themedStyles);
  
    const renderItem = ({ item, index }) => (
      <ListItem
        title={`${item.name}`}
        description={`${item.description}`}
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

  const renderProducts = () => ({ item, index }) => (
    <ListItem
      title={`${item.name}`}
      description={`${item.description}`}
    />
  );

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
        title='Venda Livre'
        accessoryLeft={renderDrawerAction}
      />
      <Divider />
      {ListDividersShowcase()}
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  listContainer: {
    maxHeight: 200,
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
  passwordInput: {
    marginTop: 16,
  },
  phoneInput: {
    marginTop: 16,
  },
  cepInput: {
    marginTop: 16,
  },
  streetAndNumberContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  streetContainer: {
    flex: 3,
    flexDirection: 'column'
  },
  streetInput: {
    marginTop: 16,
  },
  houseNumberContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column'
  },
  houseNumberInput: {
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
  }
});

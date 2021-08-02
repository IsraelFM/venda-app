import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Spinner,
  List,
  ListItem,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components';
import { showMessage } from "react-native-flash-message";

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
import { getCurrentUserDocument, updateCurrentUserDocument } from '../../firebase/users';


export default ({ navigation }) => {
  const [rawProducts, setRawProducts] = React.useState(null)
  const [products, setProducts] = React.useState([])

  React.useEffect(async () => {
    const user = await getCurrentUserDocument()
    console.log(user)
    setRawProducts(user.products)
  }, [])

  const makeProducts = () => {
    console.log(rawProducts)
    if (rawProducts) {
      for (const key in rawProducts) {
        if (Object.hasOwnProperty.call(rawProducts, key)) {
          const element = rawProducts[key];
          setProducts([...products, element])
        }
      }
    }
  }

  const renderProducts = () => ({ item, index }) => (
    <ListItem
      title={`${item.name}`}
      description={`${item.description}`}
    />
  );

  const makeList = () => {

    makeProducts()

    return (<List
      style={styles.listContainer}
      data={products}
      ItemSeparatorComponent={Divider}
      renderItem={renderProducts}
    />)
  }


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

      <KeyboardAvoidingView style={styles.container}>
        <Layout level='1'>
          {makeList() || <></>}
        </Layout>
      </KeyboardAvoidingView>
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

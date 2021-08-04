import React, { useRef } from 'react';
import {
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components';
import { showMessage } from "react-native-flash-message";
import { Formik } from 'formik';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
import InputWithError from '../../components/input-and-error';
import { CubeIconOutline, FileTextIconOutline } from './extra/icons';
import { maskCurrency } from '../../utils/mask';

import ProductValidationSchema from '../../validations/Product';
import { getCurrentUserDocument, updateCurrentUserDocument } from '../../firebase/users';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';


export default ({ navigation }) => {
  const [image, setImage] = React.useState(null);

  const formikRef = useRef();
  const formInitialValues = {
    name: '',
    description: '',
    price: '',
  };

  navigation.addListener('focus', async () => {
    const getCurrentUserDocumentResponse = await getCurrentUserDocument();
    console.log(getCurrentUserDocumentResponse)
    if (!getCurrentUserDocument.error) {
      formikRef.current?.setValues(getCurrentUserDocumentResponse);
    } else {
      showMessage({
        message: 'Ops...',
        description: getCurrentUserDocumentResponse.error,
        type: 'danger',
        duration: 2000,
        floating: true
      });
    }
  });

  const selectImage = () => {
    let options = {
      title: 'Você precisa selecionar pelo menos uma imagem',
      mediaType: 'photo',
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBackup: true
      }
    };

    launchImageLibrary(options, response => {
      console.log({ response });

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response.assets[0].uri)
        setImage(response.assets[0].uri)
      }
    });
  }

  const createProduct = async (image) => {
    const rawUserFields = JSON.parse(JSON.stringify(formikRef.current?.values));
    const products = rawUserFields.products || {}
    const name = rawUserFields.name
    products[name] = {
      name,
      description: rawUserFields.description,
      price: rawUserFields.price,
      image
    }
    delete rawUserFields.name
    delete rawUserFields.description
    delete rawUserFields.price
    const userFields = { products, ...rawUserFields }

    const updateCurrentUserDocumentResponse = await updateCurrentUserDocument({ userFields, image: image, name });
    if (updateCurrentUserDocumentResponse.success) {
      showMessage({
        message: updateCurrentUserDocumentResponse.success,
        type: 'success',
        duration: 2000,
        floating: true
      });

    } else if (updateCurrentUserDocumentResponse.error) {
      showMessage({
        message: 'Ops...',
        description: updateCurrentUserDocumentResponse.error,
        type: 'danger',
        duration: 2000,
        floating: true
      });
    };
  };

  const handleProfileSubmit = () => {
    if (image) {
      createProduct(image);
    }
  };

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
        title='Cadastrar produtos'
        accessoryLeft={renderDrawerAction}
      />
      <Divider />

      <KeyboardAvoidingView style={styles.container}>
        <Formik
          innerRef={formikRef}
          initialValues={formInitialValues}
          validationSchema={ProductValidationSchema}
          onSubmit={handleProfileSubmit}
        >
          {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isValid, touched, errors }) => (
            <>
              <Layout style={styles.formContainer} level='1'>
                <InputWithError
                  style={styles.input}
                  autoCapitalize='none'
                  maxLength={100}
                  placeholder='Nome do Produto'
                  accessoryRight={CubeIconOutline}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  flags={{ error: errors?.name, touched: touched?.name }}
                />
                <InputWithError
                  style={styles.input}
                  autoCapitalize='none'
                  maxLength={500}
                  placeholder='Descrição do Produto'
                  multiline={true}
                  accessoryRight={FileTextIconOutline}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={() => setFieldTouched('description')}
                  flags={{ error: errors?.description, touched: touched?.description }}
                />
                <InputWithError
                  style={styles.input}
                  keyboardType='numeric'
                  placeholder='Preço'
                  maxLength={15}
                  value={values.price}
                  onChangeText={(rawPrice) => setFieldValue('price', maskCurrency(rawPrice))}
                  onBlur={() => setFieldTouched('price')}
                  flags={{ error: errors?.price, touched: touched?.price }}
                />
                <Layout style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: image}} />
                </Layout>
              </Layout>
              <Button
                style={styles.editButton}
                size='giant'
                onPress={selectImage}
              >
                SELECIONE UMA IMAGEM
              </Button>
              <Button
                style={styles.editButton}
                size='giant'
                disabled={!isValid}
                onPress={handleSubmit}
              >
                CRIAR PRODUTO
              </Button>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
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
    backgroundColor: 'transparent',
  },
  input: {
    marginTop: 16,
  },
  imageContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  image: {
    width: 300,
    height: 300,
    
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

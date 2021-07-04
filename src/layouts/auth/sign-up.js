import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import {
  Button,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
  Spinner,
  Icon,
} from '@ui-kitten/components';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import { ProfileAvatar } from './extra/profile-avatar.component';
import {
  EmailIcon,
  PersonIcon,
  PlusIcon,
  GlobeIconOutline,
  PhoneOutlineIcon,
} from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { maskCep, maskPhone } from '../../utils/mask';
import InputWithError from '../../components/input-and-error';

import storage from '@react-native-firebase/storage';
import fieldsValidationUserSchema from '../../validations/user';
import { createUserDocument, createUserWithEmailAndPassword } from '../../firebase/users';

export default ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [authSuccessfully, setAuthSuccessfully] = React.useState(false);
  const [loadingCep, setLoadingCep] = React.useState(false);

  const formInitialValues = {
    username: '',
    email: '',
    password: '',
    phone: '',
    cep: '',
    street: '',
    district: '',
    city: '',
    state: '',
    houseNumber: '',
  }

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = async (data) => {
    if (!authSuccessfully) {
      const createAuthUserResponse = await createUserWithEmailAndPassword({
        email: 'data.email.trim()',
        password: 'data.password.trim()',
      });

      if (createAuthUserResponse.error) {
        showMessage({
          message: 'Ops...',
          description: createAuthUserResponse.error,
          type: 'danger',
          duration: 2000,
        });

        setAuthSuccessfully(false);
        return;
      }

      setAuthSuccessfully(true);
    }

    const createDocumentResponse = await createUserDocument({
      userUid: authResponse.user.id,
      userFields: {
        username: data.username.trim(),
        phone: data.phone.trim(),
        cep: data.cep.trim(),
        state: data.state.trim(),
        city: data.city.trim(),
        district: data.district.trim(),
        street: data.street.trim(),
        houseNumber: data.houseNumber.trim(),
      }
    });

    if (createDocumentResponse.error) {
      showMessage({
        message: 'Ops...',
        description: createDocumentResponse.error,
        type: 'danger',
        duration: 2000,
      });
    } else {
      showMessage({
        message: createDocumentResponse.error,
        type: 'success',
        duration: 2000,
      });
    }
  };

  const onSignInButtonPress = () => {
    navigation && navigation.navigate('Login');
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const renderEditAvatarButton = () => (
    <Button
      style={styles.editAvatarButton}
      status='basic'
      accessoryRight={PlusIcon}
    />
  );

  const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' />
    </View>
  );

  const searchCep = (cep, setFieldValue) => {
    if (cep.length !== 9) return;

    setLoadingCep(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        setFieldValue('street', data.logradouro)
        setFieldValue('district', data.bairro)
        setFieldValue('city', data.localidade)
        setFieldValue('state', data.uf)

        setLoadingCep(false);
      })
      .catch(() => setLoadingCep(false));
  }

  const renderPasswordIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.headerContainer}>
          <ProfileAvatar
            style={styles.profileAvatar}
            resizeMode='center'
            source={require('./assets/image-person.png')}
            editButton={renderEditAvatarButton}
          />
        </View>
        <Formik initialValues={formInitialValues} validationSchema={fieldsValidationUserSchema} onSubmit={onSignUpButtonPress} >
          {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isValid, touched, errors }) => (
            <>
              <Layout style={styles.formContainer} level='1'>
                <InputWithError
                  autoCapitalize='words'
                  maxLength={150}
                  placeholder='Nome de Usuário'
                  accessoryRight={PersonIcon}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={() => setFieldTouched('username')}
                  flags={{ error: errors?.username, touched: touched?.username }}
                />
                <InputWithError
                  style={styles.emailInput}
                  placeholder='Email'
                  maxLength={100}
                  accessoryRight={EmailIcon}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  flags={{ error: errors?.email, touched: touched?.email }}
                />
                <InputWithError
                  style={styles.passwordInput}
                  secureTextEntry={!passwordVisible}
                  placeholder='Senha'
                  maxLength={10}
                  accessoryRight={renderPasswordIcon}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  flags={{ error: errors?.password, touched: touched?.password }}
                />
                <InputWithError
                  style={styles.phoneInput}
                  keyboardType='phone-pad'
                  placeholder='Telefone (com DDD)'
                  maxLength={15}
                  accessoryRight={PhoneOutlineIcon}
                  value={values.phone}
                  onChangeText={(brutePhone) => setFieldValue('phone', maskPhone(brutePhone))}
                  onBlur={() => setFieldTouched('phone')}
                  flags={{ error: errors?.phone, touched: touched?.phone }}
                />
                <InputWithError
                  style={styles.cepInput}
                  keyboardType='numeric'
                  placeholder='CEP (informe o CEP antes de prosseguir)'
                  accessoryRight={loadingCep ? LoadingIndicator : GlobeIconOutline}
                  value={values.cep}
                  maxLength={9}
                  onChangeText={(bruteCep) => setFieldValue('cep', maskCep(bruteCep))}
                  onBlur={() => {
                    setFieldTouched('cep');
                    !errors?.cep && searchCep(values.cep, setFieldValue)
                  }}
                  flags={{ error: errors?.cep, touched: touched?.cep }}
                />
                <InputWithError
                  style={styles.cepInput}
                  placeholder='Estado'
                  maxLength={2}
                  value={values.state}
                  onChangeText={handleChange('state')}
                  onBlur={() => setFieldTouched('state')}
                  flags={{ error: errors?.state, touched: touched?.state }}
                />
                <InputWithError
                  style={styles.cepInput}
                  placeholder='Cidade'
                  maxLength={100}
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={() => setFieldTouched('city')}
                  flags={{ error: errors?.city, touched: touched?.city }}
                />
                <InputWithError
                  style={styles.cepInput}
                  placeholder='Bairro'
                  maxLength={40}
                  value={values.district}
                  onChangeText={handleChange('district')}
                  onBlur={() => setFieldTouched('district')}
                  flags={{ error: errors?.district, touched: touched?.district }}
                />
                <View style={styles.streetAndNumberContainer}>
                  <View style={styles.streetContainer}>
                    <InputWithError
                      style={styles.streetInput}
                      placeholder='Rua'
                      maxLength={100}
                      value={values.street}
                      onChangeText={handleChange('street')}
                      onBlur={() => setFieldTouched('street')}
                      flags={{ error: errors?.street, touched: touched?.street }}
                    />
                  </View>
                  <View style={styles.houseNumberContainer}>
                    <InputWithError
                      style={styles.houseNumberInput}
                      keyboardType='numeric'
                      placeholder='Número'
                      maxLength={5}
                      value={values.houseNumber}
                      onChangeText={handleChange('houseNumber')}
                      onBlur={() => setFieldTouched('houseNumber')}
                      flags={{ error: errors?.houseNumber, touched: touched?.houseNumber }}
                    />
                  </View>
                </View>
              </Layout>
              <Button
                style={styles.signUpButton}
                size='giant'
                // disabled={!isValid}
                onPress={onSignUpButtonPress}
              >
                CADASTRAR
              </Button>
            </>
          )}
        </Formik>

        <Button
          style={styles.signInButton}
          appearance='ghost'
          status='basic'
          onPress={onSignInButtonPress}>
          Já tem uma conta? Faça login
        </Button>
      </KeyboardAvoidingView>
    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'color-success-400',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    backgroundColor: 'color-success-transparent-100',
  },
  profileAvatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: 'center',
    backgroundColor: 'color-success-400',
    tintColor: 'color-primary-default',
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'background-basic-color-1',
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
  signUpButton: {
    borderRadius: 50,
    marginTop: 16,
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  errorInput: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'color-danger-600',
  }
});

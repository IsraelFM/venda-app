import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Spinner,
  StyleService,
  Text,
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
import { ConfirmModal } from '../../components/modal';
import {
  PersonIconOutline,
  GlobeIconOutline,
  PhoneOutlineIcon,
  EmailIconOutline,
  LogInOutlineIcon,
  PersonAddOutlineIcon,
} from './extra/icons';
import { searchCep } from '../../utils/cep';
import { maskCep, maskPhone } from '../../utils/mask';

import userProfileValidationSchema from '../../validations/userProfile';
import { getCurrentUserDocument, updateCurrentUserDocument, userIsLogged } from '../../firebase/users';
import { updatePassword } from '../../firebase/auth';

export default ({ navigation }) => {
  const renderHeaderText = () => (
    <Text style={styles.headerText}>
      PERFIL
    </Text>
  );

  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = React.useState(false);
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [confirmPasswordModalVisible, setConfirmPasswordModalVisible] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');

  const formikRef = useRef();
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
  };

  navigation.addListener('focus', async () => {
    if (userIsLogged()) {
      const getCurrentUserDocumentResponse = await getCurrentUserDocument();

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
    }
  });

  const updateProfile = async () => {
    const userFields = JSON.parse(JSON.stringify(formikRef.current?.values));

    delete userFields.password;
    delete userFields.email;

    const updateCurrentUserDocumentResponse = await updateCurrentUserDocument({ userFields });

    if (updateCurrentUserDocumentResponse.success) {
      showMessage({
        message: updateCurrentUserDocumentResponse.success,
        type: 'success',
        duration: 2000,
        floating: true
      });

      formikRef.current?.setFieldValue('password', '');
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

  const confirmPasswordModal = async () => {
    const updatePasswordResponse = await updatePassword({
      credentials: {
        oldPassword: oldPassword,
        password: formikRef.current?.values.password,
        email: formikRef.current?.values.email,
      }
    });

    if (updatePasswordResponse?.error) {
      showMessage({
        message: 'Ops...',
        description: updatePasswordResponse.error,
        type: 'danger',
        duration: 2000,
        floating: true
      });

      return;
    }
    toggleModalVisibility();

    await updateProfile();
  };

  const handleProfileSubmit = () => {
    if (formikRef.current?.values?.password?.trim() !== '') {
      setConfirmPasswordModalVisible(true);
    } else {
      updateProfile();
    }
  };

  const styles = useStyleSheet(themedStyles);

  const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' />
    </View>
  );

  const onPasswordIconPress = () => setPasswordVisible(!passwordVisible);
  const onOldPasswordIconPress = () => setOldPasswordVisible(!oldPasswordVisible);
  const toggleModalVisibility = () => setConfirmPasswordModalVisible(!confirmPasswordModalVisible);

  const renderPasswordIcon = (props, passwordStateWatch, passwordIconPress) => (
    <TouchableWithoutFeedback onPress={passwordIconPress}>
      <Icon {...props} name={passwordStateWatch ? 'eye-off-outline' : 'eye-outline'} />
    </TouchableWithoutFeedback>
  );

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
        alignment='center'
        style={{ backgroundColor: '#EEE' }}
        title={renderHeaderText}
        accessoryLeft={renderDrawerAction}
      />
      <Divider />

      <KeyboardAvoidingView style={styles.container}>
        {userIsLogged()
          ?
          <Formik
            innerRef={formikRef}
            initialValues={formInitialValues}
            validationSchema={userProfileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isValid, touched, errors }) => (
              <>
                <Layout style={styles.formContainer} level='1'>
                  <InputWithError
                    autoCapitalize='words'
                    maxLength={150}
                    placeholder='Nome de Usuário'
                    accessoryRight={PersonIconOutline}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={() => setFieldTouched('username')}
                    flags={{ error: errors?.username, touched: touched?.username }}
                  />
                  <InputWithError
                    placeholder='Email'
                    style={styles.emailInput}
                    maxLength={100}
                    accessoryRight={EmailIconOutline}
                    value={values.email}
                    disabled={true}
                  />
                  <InputWithError
                    style={styles.passwordInput}
                    secureTextEntry={!passwordVisible}
                    placeholder='Nova senha'
                    maxLength={10}
                    accessoryRight={(props) => renderPasswordIcon(props, passwordVisible, onPasswordIconPress)}
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
                    onChangeText={(bruteCep) => {
                      const maskedCep = maskCep(bruteCep);
                      setFieldValue('cep', (maskedCep.length > 9) ? maskedCep.slice(0, -1) : maskedCep)
                    }}
                    onBlur={() => {
                      setFieldTouched('cep');
                      !errors?.cep && searchCep(values.cep, setFieldValue, setLoadingCep)
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
                  style={styles.editButton}
                  size='giant'
                  disabled={!isValid}
                  onPress={handleSubmit}
                >
                  ATUALIZAR
                </Button>
              </>
            )}
          </Formik>
          :
          <View style={styles.authButtonsContainer} >
            <Button
              style={styles.authButtons}
              onPress={() => navigation.navigate('Auth')}
              size='giant'
              accessoryLeft={LogInOutlineIcon}
              accessoryRight={PersonAddOutlineIcon}
            >
              Clique aqui para realizar o{'\n'} LOGIN / CADASTRO
            </Button>
          </View>
        }
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={confirmPasswordModalVisible}
        title='Qual a sua senha antiga?'
        description='Precisamos que informe sua antiga senha como uma medida de segurança para alterá-la'
        onGotItButtonPress={confirmPasswordModal}
        onCancelItButtonPress={toggleModalVisibility}
        elements={(
          <InputWithError
            onChangeText={setOldPassword}
            secureTextEntry={!oldPasswordVisible}
            placeholder='Senha antiga'
            maxLength={10}
            accessoryRight={(props) => renderPasswordIcon(props, oldPasswordVisible, onOldPasswordIconPress)}
          />
        )}
      />
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
  },
  container: {
    backgroundColor: 'color-success-400',
  },
  authButtonsContainer: {
    height: '100%',
    marginHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtons: {
    width: '100%',
    marginVertical: 10,
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

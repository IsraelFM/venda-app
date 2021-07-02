import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Input,
  Layout,
  StyleService,
  useStyleSheet,
  Spinner,
  Icon,
} from '@ui-kitten/components';

import { ProfileAvatar } from './extra/profile-avatar.component';
import {
  EmailIcon,
  PersonIcon,
  PlusIcon,
  GlobeIconOutline,
  PhoneOutlineIcon,
} from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';

export default ({ navigation }) => {
  const [userName, setUserName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [phone, setPhone] = React.useState();
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [cep, setCep] = React.useState();
  const [number, setNumber] = React.useState();
  const [dataCep, setDataCep] = React.useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
  });

  const styles = useStyleSheet(themedStyles);

  const onSignUpButtonPress = () => {
    navigation && navigation.goBack();
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
      <Spinner size='small'/>
    </View>
  );

  const searchCep = () => {
    if (cep.length !== 8) return;
    
    setLoadingCep(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        setDataCep({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
        });

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
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <ProfileAvatar
          style={styles.profileAvatar}
          resizeMode='center'
          source={require('./assets/image-person.png')}
          editButton={renderEditAvatarButton}
        />
      </View>
      <Layout style={styles.formContainer} level='1'>
        <Input
          autoCapitalize='words'
          maxLength={150}
          placeholder='Nome de Usuário'
          accessoryRight={PersonIcon}
          value={userName}
          onChangeText={setUserName}
        />
        <Input
          style={styles.emailInput}
          placeholder='Email'
          maxLength={100}
          accessoryRight={EmailIcon}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.passwordInput}
          secureTextEntry={!passwordVisible}
          placeholder='Senha'
          maxLength={10}
          accessoryRight={renderPasswordIcon}
          value={password}
          onChangeText={setPassword}
        />
        <Input
          style={styles.phoneInput}
          keyboardType='phone-pad'
          placeholder='Telefone'
          maxLength={8}
          accessoryRight={PhoneOutlineIcon}
          value={phone}
          onChangeText={setPhone}
        />
        <Input
          style={styles.cepInput}
          keyboardType='numeric'
          placeholder='CEP (informe o CEP e abaixo será completado)'
          accessoryRight={loadingCep ? LoadingIndicator : GlobeIconOutline}
          value={cep}
          maxLength={8}
          onChangeText={setCep}
          onBlur={searchCep}
        />
        <Input
          style={styles.cepInput}
          placeholder='Estado'
          maxLength={2}
          value={dataCep.uf}
          onChangeText={(uf) => setDataCep({ uf })}
        />
        <Input
          style={styles.cepInput}
          placeholder='Cidade'
          maxLength={100}
          value={dataCep.localidade}
          onChangeText={(localidade) => setDataCep({ localidade })}
        />
        <Input
          style={styles.cepInput}
          placeholder='Bairro'
          maxLength={40}
          value={dataCep.bairro}
          onChangeText={(bairro) => setDataCep({ bairro })}
        />
        <View style={styles.streetAndNumberContainer}>
          <Input
            style={styles.streetInput}
            placeholder='Rua'
            maxLength={100}
            value={dataCep.logradouro}
            onChangeText={(logradouro) => setDataCep({ logradouro })}
            />
          <Input
            style={styles.numberInput}
            keyboardType='numeric'
            placeholder='Número'
            maxLength={5}
            value={number}
            onChangeText={setNumber}
          />
        </View>
      </Layout>
      <Button
        style={styles.signUpButton}
        size='giant'
        onPress={onSignUpButtonPress}>
        CADASTRAR
      </Button>
      <Button
        style={styles.signInButton}
        appearance='ghost'
        status='basic'
        onPress={onSignInButtonPress}>
        Já tem uma conta? Faça login
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'background-basic-color-1',
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
    backgroundColor: 'background-basic-color-1',
    tintColor: 'color-primary-default',
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  emailInput: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  cepInput: {
    marginTop: 16,
  },
  streetAndNumberContainer: {
    flex: 1,
    flexDirection: 'row',    
  },
  streetInput: {
    flex: 3,
    marginTop: 16,
  },
  numberInput: {
    flex: 1,
    marginLeft: 16,
    marginTop: 16,
  },
  phoneInput: {
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
});

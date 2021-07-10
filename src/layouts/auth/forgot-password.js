import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';

import { ImageOverlay } from './extra/image-overlay.component';
import { EmailIcon } from './extra/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
import { sendPasswordResetEmail } from '../../firebase/auth';

export default ({ navigation }) => {
  const [email, setEmail] = React.useState('');

  const onResetPasswordButtonPress = async () => {
    if (email.trim() === '') {
      showMessage({
        message: 'É preciso informar um email',
        type: 'warning',
        duration: 2000,
      });

      return;
    }

    const sendPasswordResponse = await sendPasswordResetEmail({ email });

    if (sendPasswordResponse.error) {
      showMessage({
        message: sendPasswordResponse.error,
        type: 'error',
        backgroundColor: 'red',
        duration: 2000,
      });

      return;
    }

    showMessage({
      message: sendPasswordResponse.success,
      type: 'success',
      duration: 2000,
    });

    navigation && navigation.goBack();
  };

  return (
    <KeyboardAvoidingView>
      <ImageOverlay
        style={styles.container}
      // source={require('./assets/image-background.jpg')}
      >
        <Text
          style={styles.forgotPasswordLabel}
          category='h4'
          status='control'>
          Esqueci minha senha
        </Text>
        <Text
          style={styles.enterEmailLabel}
          status='control'>
          Por favor, informe seu email
        </Text>
        <View style={styles.formContainer}>
          <Input
            autoCapitalize='none'
            status='control'
            placeholder='Email'
            accessoryRight={EmailIcon}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Button
          size='giant'
          style={styles.resetPasswordButton}
          onPress={onResetPasswordButtonPress}>
          RECUPERAR A SENHA
        </Button>
      </ImageOverlay>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  resetPasswordButton: {
    borderRadius: 50,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  forgotPasswordLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 24,
  },
  enterEmailLabel: {
    zIndex: 1,
    alignSelf: 'center',
    marginTop: 64,
  },
});

import auth from '@react-native-firebase/auth';

export const {
  createAuthWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} = {
  createAuthWithEmailAndPassword: async ({
    email,
    password,
  }) => {
    try {
      return await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return {
          error: 'O endereço de email já está em uso'
        }
      }

      if (error.code === 'auth/invalid-email') {
        return {
          error: 'O endereço de email informado é inválido'
        }
      }

      // TODO: Registrar log no Analytics
      return {
        error: 'Um erro inesperado aconteceu. Por favor, tente novamente mais tarde'
      }
    }
  },
  signInWithEmailAndPassword: async ({
    email,
    password,
  }) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);

      return {
        success: 'Acesso concedido!'
      }
    } catch (error) {
      if (error.code === 'auth/user-disabled') {
        return {
          error: 'O usuário vinculado a esse email foi inativado'
        }
      }

      if (error.code === 'auth/invalid-email') {
        return {
          error: 'O endereço de email informado é inválido'
        }
      }

      // TODO: Registrar log no Analytics
      return {
        error: 'O email ou a senha estão incorretos'
      }
    }
  },
  sendPasswordResetEmail: async ({
    email,
  }) => {
    try {
      await auth().sendPasswordResetEmail(email);

      return {
        success: 'Verifique sua caixa de entrada resetar sua senha'
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return {
          error: 'Tem certeza que esse email está vinculado à sua conta?'
        }
      }

      if (error.code === 'auth/invalid-email') {
        return {
          error: 'O endereço de email informado é inválido'
        }
      }

      // TODO: Registrar log no Analytics
      return {
        error: 'Um erro aconteceu ao tentar recuperar sua senha. Por favor, tente novamente'
      }
    }
  },
  updatePassword: async ({ credentials }) => {
    try {
      if (credentials.oldPassword) {
        const credentialForEmail = auth.EmailAuthProvider.credential(credentials.email, credentials.oldPassword);

        await auth().currentUser.reauthenticateWithCredential(credentialForEmail);
        await auth().currentUser.updatePassword(credentials.password);
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao atualizar a sua senha. Estamos contactando o suporte'
      }
    }
  },
}

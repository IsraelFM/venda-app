import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const {
  createUserWithEmailAndPassword,
  createUserDocument,
} = {
  createUserWithEmailAndPassword: async ({
    email,
    password,
  }) => {
    try {
      return await auth().createUserWithEmailAndPassword(email.trim(), password.trim())
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

      console.error(error);
    }
  },
  createUserDocument: async ({
    userUid,
    userFields,
  }) => {
    try {
      await firestore()
        .collection('Users')
        .doc(userUid)
        .set(userFields);

      authResponse.user.sendEmailVerification();

      return {
        success: 'Usuário criado. Cheque seu email para confirmar sua conta'
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar cadastrar seu usuário. Por favor, tente novamente'
      }
    }
  }
}

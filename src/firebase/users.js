import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const {
  createUserDocument,
  getCurrentUserDocument,
  updateCurrentUserDocument,
} = {
  createUserDocument: async ({
    userUid,
    userFields,
  }) => {
    try {
      await firestore()
        .collection('Users')
        .doc(userUid)
        .set(userFields);

      return {
        success: 'Usuário criado. Verifique seu email para confirmar sua conta'
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar cadastrar seu usuário. Por favor, tente novamente'
      }
    }
  },
  getCurrentUserDocument: async () => {
    try {
      const user = await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .get();

      return {
        ...user.data(),
        email: auth().currentUser.email,
        password: '',
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar buscar seu perfil. Estamos contactando o suporte'
      }
    }
  },
  updateCurrentUserDocument: async ({ userFields }) => {
    try {
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update(userFields);

      return {
        success: 'Perfil atualizado'
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao atualizar seu perfil. Estamos contactando o suporte'
      }
    }
  },
}

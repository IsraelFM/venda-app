import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

export const {
  userIsLogged,
  userType,
  userId,
  createUserDocument,
  getCurrentUserDocument,
  getAllSellers,
  updateCurrentUserDocument,
  deleteUserProduct
} = {
  userIsLogged: () => auth()?.currentUser ? true : false,
  userType: async () => auth()?.currentUser ? (await getCurrentUserDocument())?.type : 'buyer',
  userId: () => auth()?.currentUser?.uid,
  createUserDocument: async ({
    userUid,
    userFields,
  }) => {
    try {
      await firestore()
        .collection('Users')
        .doc(userUid)
        .set(userFields);

      await auth().currentUser.updateProfile({
        displayName: userFields.username
      });

      return {
        success: 'Usuário criado. Verifique seu email para confirmar sua conta'
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar cadastrar seu usuário. Por favor, tente novamente'
      }
    }
  },
  getCurrentUserDocument: async ({ uid } = {}) => {
    try {
      const user = await firestore()
        .collection('Users')
        .doc(uid ? uid : auth().currentUser.uid)
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
  getAllSellers: async () => {
    try {
      const sellers = await firestore()
        .collection('Users')
        .where('type', '==', 'seller')
        .get();

      return sellers;
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar buscar os vendedores. Estamos contactando o suporte'
      }
    }
  },
  updateCurrentUserDocument: async ({ userFields, image = false, name = null }) => {
    try {
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update(userFields);

      if (image && name) {
        const ext = image.split('.').pop();
        const reference = `${new Date().getTime()}.${ext}`
        await storage().ref(reference).putFile(image)
        const uri = await storage().ref(reference).getDownloadURL()
        userFields.products[name].uri = uri
        await firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .update(userFields);

        return {
          success: 'Produto atualizado'
        }    
      }
      return {
        success: 'Perfil atualizado'
      }
    } catch (error) {
      console.log(error)
      return {
        error: 'Um erro aconteceu ao atualizar seu perfil. Estamos contactando o suporte'
      }
    }
  },
  deleteUserProduct: async ({ toDelete }) => {
    await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .set({
        products: {
          [toDelete]: firestore.FieldValue.delete()
        }
      }, {
        merge: true,
      });
  }
}

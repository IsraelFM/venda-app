import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

export const {
  createUserDocument,
  getCurrentUserDocument,
  updateCurrentUserDocument,
  deleteUserProduct
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
  updateCurrentUserDocument: async ({ userFields, image = false, name = null }) => {
    try {
      console.log('update', userFields)
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update(userFields);

      if (image && name) {
        const ext = image.split('.').pop();
        console.log(ext)
        console.log(image)
        const reference = `${new Date().getTime()}.${ext}`
        await storage().ref(reference).putFile(image)
        const uri = await storage().ref(reference).getDownloadURL()
        userFields.products[name].uri = uri
        console.log(uri)
        await firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .update(userFields);
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

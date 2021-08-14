import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const {
  addToCart,
  getCartFromCurrentUser,
  createOrder,
  clearCartFromCurrentUser,
} = {
  addToCart: async ({
    newProduct,
    sellerId,
  }) => {
    try {
      const userCart = (await firestore()
        .collection('Cart')
        .doc(auth().currentUser.uid)
        .get()).data();

      const productFromSameSeller = !userCart || (userCart.sellerId === sellerId)
        ? true
        : false;

      if (!productFromSameSeller) {
        return {
          error: 'Você está tentando adicionar um produto de outro vendedor! \nSe quiser continuar, limpe seu carrinho'
        }
      }

      let products = Object.values(userCart?.products || []);
      const productAlreadyExistsInCart = products.find(productDetails => productDetails.name === newProduct.name);

      if (!productAlreadyExistsInCart) products.push(newProduct);
      else ++productAlreadyExistsInCart.quantity;

      let totalPrice = userCart ? userCart.totalPrice : '0';
      totalPrice = (+totalPrice.replace(/\./g, '').replace(/,/g, '.') + +newProduct.unitPrice.replace(/\./g, '').replace(/,/g, '.'))

      await firestore()
        .collection('Cart')
        .doc(auth().currentUser.uid)
        .set({
          products,
          sellerId,
          totalPrice: `${totalPrice.toFixed(2)}`.replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        });

      return {
        success: 'Pedido adicionado ao carrinho'
      }
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar adicionar o produto ao seu carrinho. Estamos contatando o suporte'
      }
    }
  },
  getCartFromCurrentUser: async () => {
    try {
      const cart = await firestore()
        .collection('Cart')
        .doc(auth().currentUser.uid)
        .get();

      return cart.data();
    } catch (error) {
      return {
        error: 'Um erro aconteceu ao tentar buscar seu perfil. Estamos contactando o suporte'
      }
    }
  },
  createOrder: async ({
    paymentMethod,
    deliveryMethod,
    products,
    sellerId,
    totalPrice,
  }) => {

    try {
      await firestore()
        .collection('Order')
        .doc()
        .set({
          paymentMethod,
          deliveryMethod,
          products,
          totalPrice,
          sellerId,
          buyerId: auth().currentUser.uid,
        });

      // if (!(await clearCartFromCurrentUser())) {
      //   return {
      //     error: 'Um erro aconteceu ao limpar o seu carrinho',
      //   }
      // }

      return {
        success: 'Pedido enviado com sucesso'
      }
    } catch (error) {
      console.log(error.message);
      return {
        error: 'Um erro aconteceu ao tentar enviar seu pedido. Estamos contactando o suporte'
      }
    }
  },
  clearCartFromCurrentUser: async () => {
    try {
      const cartDeleted = await firestore()
        .collection('Cart')
        .doc(auth().currentUser.uid)
        .delete();

      console.log(cartDeleted);
      if (cartDeleted) return true;
    } catch (error) {
      return false;
    }
  }
};

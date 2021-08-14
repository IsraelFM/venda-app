import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const {
  addToCart,
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
          error: 'Você está tentando adicionar um produto de outro vendedor'
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
  // TODO: Cart (temporary) != Order (permanent)
};

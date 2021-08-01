import * as yup from 'yup';

const ProductValidationSchema = yup.object().shape({
  name: yup
    .string()
    .max(100)
    .required('Por favor, informe o nome do produto'),
  description: yup
    .string()
    .max(500)
    .required('Por favor, informe a descrição do produto'),
  price: yup
    .string()
    .max(10)
    .transform(price => {
      return price.replace(/\D+/g, '');
    })
    .required('Por favor, informe o preço do produto'),
});

export default ProductValidationSchema;

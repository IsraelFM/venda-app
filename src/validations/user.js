import * as yup from 'yup';

const fieldsValidationUserSchema = yup.object().shape({
  username: yup
    .string()
    .max(150)
    .required('Por favor, informe seu nome'),
  email: yup
    .string()
    .max(100)
    .email('Email inválido. Insira um email um email no formato seu@email.com')
    .required('É preciso informar uma descrição para o produto'),
  password: yup
    .string()
    .min(8, 'A senha precisa ter, no mínimo, 8 caracteres')
    .max(10, 'A senha pode ter no máximo 10 caracteres')
    .required('Por favor, informe uma senha'),
  phone: yup
    .string()
    .max(15)
    .required('Por favor, informe seu telefone'),
  cep: yup
    .string()
    .max(9, 'Por favor, insira um CEP válido')
    .min(9, 'Por favor, insira um CEP válido')
    .required('Qual o CEP de onde você mora?'),
  state: yup
    .string()
    .length(2)
    .max(2)
    .required('Qual a sigla do estado em você mora?'),
  city: yup
    .string()
    .max(100)
    .required('Em que cidade você mora?'),
  district: yup
    .string()
    .max(40)
    .required('Qual o nome do bairro onde você mora?'),
  street: yup
    .string()
    .max(100)
    .required('Qual o nome da sua rua?'),
  houseNumber: yup
    .string()
    .max(5)
    .notRequired('Qual o número da sua residência?'),
});

export default fieldsValidationUserSchema;

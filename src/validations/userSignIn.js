import * as yup from 'yup';

const userSignInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .max(100)
    .email('Email inválido. Insira um email um email no formato seu@email.com')
    .required('Informe um email para logar no app'),
  password: yup
    .string()
    .min(8, 'A senha precisa ter, no mínimo, 8 caracteres')
    .max(10, 'A senha pode ter no máximo 10 caracteres')
    .required('Por favor, informe uma senha'),
});

export default userSignInValidationSchema;

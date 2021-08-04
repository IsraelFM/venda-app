export const searchCep = (cep, setFieldValue, setLoadingCep) => {
  if (cep.length !== 9) return;

  setLoadingCep(true);
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      setFieldValue('street', data.logradouro)
      setFieldValue('district', data.bairro)
      setFieldValue('city', data.localidade)
      setFieldValue('state', data.uf)

      setLoadingCep(false);
    })
    .catch(() => setLoadingCep(false));
}

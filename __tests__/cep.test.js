import { searchCep } from "../src/utils/cep";

it("deve retornar undefined caso o tamanho do cep seja diferente de 9", async () => {
  const setFieldValue = () => {};
  const setLoadingCep = () => {};
  const response = await searchCep("12345", setFieldValue, setLoadingCep);
  expect(response).toBe(undefined);
});

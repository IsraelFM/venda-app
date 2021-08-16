import { maskCep, maskPhone, maskCurrency } from "../src/utils/mask";

it("deve retornar um cep sem mascara com mascara", async () => {
  const mockCep = "37470000";
  const response = maskCep(mockCep);
  expect(response).toBe("37470-000");
});

it("deve retornar um cep com mascara com a mesma mascara", async () => {
  const mockCep = "37470-000";
  const response = maskCep(mockCep);
  expect(response).toBe("37470-000");
});

it("deve altera a posição do traço para a posicao correta independente do tamanho da string", async () => {
  const mockCep = "3741231270-0000";
  const response = maskCep(mockCep);
  expect(response).toBe("37412-312700000");
});

it("deve retornar um celular com mascara nas posicoes corretas", async () => {
  const mockCep = "35988592560";
  const response = maskPhone(mockCep);
  expect(response).toBe("(35) 98859-2560");
});

it("deve retornar um telefone fixo com mascara nas posicoes corretas", async () => {
  const mockCep = "3533312560";
  const response = maskPhone(mockCep);
  expect(response).toBe("(35) 3331-2560");
});

it("deve retornar um valor monetario com mascara na casa de milhar e de centavos", async () => {
  const mockCep = "3333.33";
  const response = maskCurrency(mockCep);
  expect(response).toBe("3.333,33");
});

it("deve retornar um valor monetario com mascara na casa de dezenas e de centavos", async () => {
  const mockCep = "10.33";
  const response = maskCurrency(mockCep);
  expect(response).toBe("10,33");
});

it("deve retornar um valor monetario com mascara com menos de 10 reais", async () => {
  const mockCep = "5.54";
  const response = maskCurrency(mockCep);
  expect(response).toBe("5,54");
});

import gasBoost from "../../../lib/utils/gasBoost";

const contractMethodMock = jest.fn(
  () => new Promise(resolve => resolve({ transactionHash: "0xBLUB" })),
);
contractMethodMock.estimateGas = jest.fn(() => 600000);

it("boosts gas", async () => {
  const receipt = await gasBoost(contractMethodMock, [10, 5], {
    from: "0xADDRESS",
  });
  expect(receipt.transactionHash).toEqual("0xBLUB");
});

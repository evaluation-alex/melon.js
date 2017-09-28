import contract from "truffle-contract";
import BigNumber from "bignumber.js";

import takeOrderFromFund from "../../../../lib/fund/transactions/takeOrderFromFund";

/* eslint-disable global-require */
jest.mock("truffle-contract", () => require("../../../mocks/truffle-contract"));
/* eslint-enable */

test("without quantity (-> max) & basic calling testing", async () => {
  const result = await takeOrderFromFund(6870, "0xVAULT");

  expect(result).toBeTruthy();
  expect(result.executedQuantity.eq("8.55505176")).toBeTruthy();
  expect(contract).toHaveBeenCalled();
  expect(contract.mockInspect.contract.setProvider).toHaveBeenCalled();
  expect(contract.mockInspect.contract.at).toHaveBeenCalled();
  expect(contract.mockInspect.instance.getOrder).toHaveBeenCalledWith(
    "0xSIMPLEMARKET",
    6870,
  );
});

test("with higher quantity -> take max", async () => {
  const result = await takeOrderFromFund(
    6870,
    "0xVAULT",
    new BigNumber("9.55505176"),
    "0xMANAGER",
  );

  expect(result).toBeTruthy();
  expect(result.executedQuantity.eq("8.55505176")).toBeTruthy();
  expect(
    contract.mockInspect.instance.takeOrder,
  ).toHaveBeenCalledWith(6870, new BigNumber("8555051760000000000"), {
    from: "0xMANAGER",
    gas: 60000,
  });
});

test("with lower quantity -> take as specified", async () => {
  const result = await takeOrderFromFund(
    6870,
    "0xVAULT",
    new BigNumber("1"),
    "0xMANAGER",
  );

  expect(result).toBeTruthy();
  expect(result.executedQuantity.eq("1")).toBeTruthy();
  expect(
    contract.mockInspect.instance.takeOrder,
  ).toHaveBeenCalledWith(6870, new BigNumber("1000000000000000000"), {
    from: "0xMANAGER",
    gas: 60000,
  });
});

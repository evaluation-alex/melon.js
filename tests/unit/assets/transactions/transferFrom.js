import BigNumber from "bignumber.js";
import contract from "truffle-contract";

import transferFrom from "../../../../lib/assets/transactions/transferFrom";

// eslint-disable-next-line global-require
jest.mock("truffle-contract", () => require("../../../mocks/truffle-contract"));

test("transferFrom", async () => {
  const result = await transferFrom("ETH-T", "0x1", "0x2", new BigNumber(5));

  expect(result).toBeTruthy();
  expect(contract).toHaveBeenCalledTimes(1);
  expect(contract().setProvider).toHaveBeenCalledTimes(1);
  expect(contract().at).toHaveBeenCalledWith(
    "0x1a825e9bf3bdc8ef8b975f97c78b5208a947d0ec",
  );
  expect(
    contract.mockInspect.instance.transferFrom,
  ).toHaveBeenCalledWith("0x1", "0x2", new BigNumber(5 * 10 ** 18), {
    from: "0x2",
    gas: 60000,
  });
});

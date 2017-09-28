import BigNumber from "bignumber.js";
import contract from "truffle-contract";

import transferTo from "../../../../lib/assets/transactions/transferTo";

// eslint-disable-next-line global-require
jest.mock("truffle-contract", () => require("../../../mocks/truffle-contract"));

test("transferTo", async () => {
  const result = await transferTo("ETH-T", "0x1", new BigNumber(3));

  expect(result).toBeTruthy();
  expect(contract).toHaveBeenCalledTimes(1);
  expect(contract().setProvider).toHaveBeenCalledTimes(1);
  expect(contract().at).toHaveBeenCalledWith(
    "0x1a825e9bf3bdc8ef8b975f97c78b5208a947d0ec",
  );
  expect(
    contract.mockInspect.instance.transfer,
  ).toHaveBeenCalledWith("0x1", new BigNumber(3 * 10 ** 18), {
    from: "0xUSER",
    gas: 60000,
  });
});

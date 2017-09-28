// @flow
import BigNumber from "bignumber.js";
import findEventInLog from "../../utils/findEventInLog";
import getTokenContract from "../contracts/getTokenContract";
import toProcessable from "../utils/toProcessable";
import setup from "../../utils/setup";
import gasBoost from "../../utils/gasBoost";

const transferTo = async (
  symbol: string,
  toAddress: string,
  quantity: BigNumber,
  from: string = setup.defaultAccount,
) => {
  const tokenContract = await getTokenContract(symbol);
  const args = [toAddress, toProcessable(quantity, symbol)];
  const receipt = await gasBoost(tokenContract.transfer, args, { from });
  const transferLogEntry = findEventInLog("Transfer", receipt);

  return !!transferLogEntry;
};

export default transferTo;

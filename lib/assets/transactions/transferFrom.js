// @flow
import BigNumber from "bignumber.js";
import findEventInLog from "../../utils/findEventInLog";
import getTokenContract from "../contracts/getTokenContract";
import toProcessable from "../utils/toProcessable";

/*
  @pre: quantity has been approved from fromAddress to toAddress with the approve function
  @param quantity: BigNumber
*/
const transferFrom = async (
  symbol: string,
  fromAddress: string,
  toAddress: string,
  quantity: BigNumber,
) => {
  const tokenContract = await getTokenContract(symbol);
  const receipt = await tokenContract.transferFrom(
    fromAddress,
    toAddress,
    toProcessable(quantity, symbol),
    { from: toAddress },
  );
  const transferLogEntry = findEventInLog("Transfer", receipt);
  return !!transferLogEntry;
};

export default transferFrom;

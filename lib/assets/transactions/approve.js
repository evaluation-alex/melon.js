// @flow
import BigNumber from "bignumber.js";
import setup from "../../utils/setup";
import trace from "../../utils/trace";
import findEventInLog from "../../utils/findEventInLog";
import getTokenContract from "../contracts/getTokenContract";
import toProcessable from "../utils/toProcessable";
import gasBoost from "../../utils/gasBoost";

const approve = async (
  symbol: string,
  spender: string,
  quantity: BigNumber,
  from: string = setup.defaultAccount,
) => {
  trace("Approve", { quantity, from, symbol });
  const tokenContract = await getTokenContract(symbol);
  const args = [spender, toProcessable(quantity, symbol)];
  const options = { from };
  const receipt = await gasBoost(tokenContract.approve, args, options);
  const approvalLogEntry = findEventInLog("Approval", receipt);
  return !!approvalLogEntry;
};

export default approve;

// @flow
import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import getOrder from "../../exchange/calls/getOrder";
import toProcessable from "../../assets/utils/toProcessable";
import getAddress from "../../assets/utils/getAddress";
import findEventInLog from "../../utils/findEventInLog";
import gasBoost from "../../utils/gasBoost";
import getFundContract from "../contracts/getFundContract";

const makeOrderFromFund = async (
  vaultAddress: string,
  sellWhichToken: string,
  buyWhichToken: string,
  sellHowMuch: BigNumber,
  buyHowMuch: BigNumber,
  from: string = setup.defaultAccount,
) => {
  const fundContract = await getFundContract(vaultAddress);

  const args = [
    getAddress(sellWhichToken),
    getAddress(buyWhichToken),
    toProcessable(sellHowMuch, sellWhichToken),
    toProcessable(buyHowMuch, buyWhichToken),
  ];

  const receipt = await gasBoost(fundContract.makeOrder, args, { from });

  const updateLog = findEventInLog("OrderUpdated", receipt);
  const orderId = updateLog.args.id;

  if (!receipt || !orderId)
    throw new Error(`Error with makeOrder: ${JSON.stringify(receipt)}`);
  const createdOrder = await getOrder(orderId);
  return createdOrder;
};

export default makeOrderFromFund;

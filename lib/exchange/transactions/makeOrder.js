import getSimpleMarketContract from "../contracts/getSimpleMarketContract";
import setup from "../../utils/setup";
import rush from "../../utils/rush";
import findEventInLog from "../../utils/findEventInLog";
import getOrder from "../../exchange/calls/getOrder";
import toProcessable from "../../assets/utils/toProcessable";
import getAddress from "../../assets/utils/getAddress";
import approve from "../../assets/transactions/approve";
import depositAndApproveEther from "../../participation/transactions/depositAndApproveEther";
import gasBoost from "../../utils/gasBoost";

const makeOrder = async ({
  sell: { howMuch: sellHowMuch, symbol: sellSymbol },
  buy: { howMuch: buyHowMuch, symbol: buySymbol },
  from = setup.defaultAccount,
  timeout = 30 * 1000,
}) => {
  const simpleMarketContract = await getSimpleMarketContract();

  const approvePromise =
    sellSymbol === "ETH-T"
      ? depositAndApproveEther(
          from,
          simpleMarketContract.address,
          sellHowMuch,
          sellSymbol,
        )
      : approve(
          sellSymbol,
          simpleMarketContract.address,
          toProcessable(sellHowMuch, sellSymbol),
        );

  await rush(
    approvePromise,
    `Approve took longer that 30 seconds. ${sellHowMuch.toString()} ${sellSymbol} ${simpleMarketContract.address}`,
    30 * 1000,
  );

  const args = [
    toProcessable(sellHowMuch, sellSymbol),
    getAddress(sellSymbol),
    toProcessable(buyHowMuch, buySymbol),
    getAddress(buySymbol),
  ];
  const receipt = await rush(
    gasBoost(simpleMarketContract.offer, args, { from }),
    `simpleMarketContract.offer took longer than ${timeout}`,
    timeout,
  );

  findEventInLog("LogMake", receipt);
  const updateLog = findEventInLog("LogItemUpdate", receipt);
  const orderId = updateLog.args.id;

  if (!receipt || !orderId)
    throw new Error(
      `Error with make on Simple Market: \n ${JSON.stringify(
        receipt,
        null,
        4,
      )}`,
    );
  const createdOrder = await getOrder(orderId);
  return createdOrder;
};

export default makeOrder;

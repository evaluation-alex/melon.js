import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import ensure from "../../utils/ensure";
import gasBoost from "../../utils/gasBoost";
import findEventInLog from "../../utils/findEventInLog";
import approve from "../../assets/transactions/approve";
import toProcessable from "../../assets/utils/toProcessable";
import toReadable from "../../assets/utils/toReadable";
import getFundContract from "../../fund/contracts/getFundContract";
import getDataFeedContract from "../../datafeeds/contracts/getDataFeedContract";
// We'll have to bring it back later
// import isSubscribeRequestPermitted from "../../participation/calls/isSubscribeRequestPermitted";
import getAddress from "../../assets/utils/getAddress";
/*
  @param numShares: BigNumber quantity of Shares wanted to receive with decimals
  @param offeredValue: BigNumber quantitiy of Ether willing to offer with decimals
*/
const subscribe = async (
  vaultAddress,
  numShares,
  offeredValue,
  incentiveValue = new BigNumber(0.01),
  subscriber = setup.defaultAccount,
) => {
  const fundContract = await getFundContract(vaultAddress);
  const dataFeedContract = await getDataFeedContract();

  ensure(
    await fundContract.isSubscribeAllowed(),
    "Subscriptions to vault are disabled",
  );
  ensure(incentiveValue.gt(0), "incentiveValue must be greater than 0");
  const isValid = await dataFeedContract.isValid(getAddress("MLN-T"));
  ensure(isValid, "Data not valid");
  // We'll have to bring it back later
  // ensure(
  //   await isSubscribeRequestPermitted({ numShares, offeredValue, subscriber }),
  //   "Subscribe is not permitted",
  // );

  await approve("MLN-T", vaultAddress, offeredValue + incentiveValue);

  const args = [
    toProcessable(numShares, "MLN-T"),
    toProcessable(offeredValue, "MLN-T"),
    toProcessable(incentiveValue, "MLN-T"),
  ];
  const options = {
    from: subscriber,
  };

  // TODO: really check if preflight is ok
  // const preflightOk = await fundContract.subscribe.call(...args);

  const receipt = await gasBoost(
    fundContract.requestSubscription,
    args,
    options,
  );
  const subscribeRequestLogEntry = findEventInLog("SubscribeRequest", receipt);

  return {
    numShares: toReadable(subscribeRequestLogEntry.args.numShares),
    atTimestamp: new Date( // TODO change to timestamp
      subscribeRequestLogEntry.args.atTimestamp.times(1000).toNumber(),
    ),
    id: subscribeRequestLogEntry.args.requestId,
  };
};

export default subscribe;

import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import toProcessable from "../../assets/utils/toProcessable";
import toReadable from "../../assets/utils/toReadable";
import findEventInLog from "../../utils/findEventInLog";
import ensure from "../../utils/ensure";
import getFundContract from "../../fund/contracts/getFundContract";
import gasBoost from "../../utils/gasBoost";

const redeem = async (
  fundAddress,
  numShares,
  requestedValue,
  incentiveValue = new BigNumber(0.01),
  investor = setup.defaultAccount,
) => {
  const fundContract = await getFundContract(fundAddress);
  const args = [
    toProcessable(numShares),
    toProcessable(requestedValue),
    toProcessable(incentiveValue),
  ];
  const options = {
    from: investor,
  };

  const receipt = await gasBoost(fundContract.requestRedemption, args, options);
  const redeemRequestLogEntry = findEventInLog("RedeemRequest", receipt);

  ensure(
    redeemRequestLogEntry.args.numShares.eq(toProcessable(numShares)),
    "requested numShares is not equal to retrieved quantity",
    redeemRequestLogEntry,
  );

  return {
    numShares: toReadable(redeemRequestLogEntry.args.numShares),
    atTimeStamp: new Date(
      redeemRequestLogEntry.args.atTimestamp.times(1000).toNumber(),
    ),
    id: redeemRequestLogEntry.args.requestId,
  };
};

export default redeem;

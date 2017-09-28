import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import findEventInLog from "../../utils/findEventInLog";
import toReadable from "../../assets/utils/toReadable";
import gasBoost from "../../utils/gasBoost";
import getFundContract from "../../fund/contracts/getFundContract";

const executeRequest = async (
  requestId,
  fundAddress,
  from = setup.defaultAccount,
) => {
  const fundContract = await getFundContract(fundAddress);

  const request = await fundContract.requests(requestId);
  let executeRequestLogEntry;
  let receipt;

  console.log(request);

  if (request[2].eq(new BigNumber(0))) {
    receipt = await gasBoost(fundContract.executeRequest, [requestId], {
      from,
    });

    executeRequestLogEntry = findEventInLog("Subscribed", receipt);
  } else if (request[2].eq(new BigNumber(1))) {
    receipt = await gasBoost(fundContract.executeRequest, [requestId], {
      from,
    });
    executeRequestLogEntry = findEventInLog("Redeemed", receipt);
  }

  return toReadable(executeRequestLogEntry.args.numShares);
};

export default executeRequest;

// @flow
import setup from "../../utils/setup";
import findEventInLog from "../../utils/findEventInLog";
import gasBoost from "../../utils/gasBoost";
import getFundContract from "../contracts/getFundContract";

const cancelOrderFromFund = async (
  id: string,
  vaultAddress: string,
  from: string = setup.web3.eth.defaultAccount,
) => {
  const fundContract = await getFundContract(vaultAddress);

  const receipt = await gasBoost(fundContract.cancel, [id], { from });

  const canceled = findEventInLog(
    "LogKill",
    receipt,
    "Error during order cancelation",
  );

  return canceled;
};

export default cancelOrderFromFund;

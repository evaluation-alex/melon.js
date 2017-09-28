// @flow
import setup from "../../utils/setup";
import rush from "../../utils/rush";
import getSimpleMarketContract from "../contracts/getSimpleMarketContract";
import findEventInLog from "../../utils/findEventInLog";
import gasBoost from "../../utils/gasBoost";

const cancelOrder = async (id: string, from: string = setup.defaultAccount) => {
  const simpleMarketContract = await getSimpleMarketContract();
  const boosted = gasBoost(simpleMarketContract.cancel, [id], { from });
  const receipt = await rush(
    boosted,
    `Cancelling order ${id} took more than 10 seconds.`,
    10 * 1000,
  );

  const canceled = findEventInLog(
    "LogKill",
    receipt,
    "Error during order cancelation",
  );

  return canceled;
};

export default cancelOrder;

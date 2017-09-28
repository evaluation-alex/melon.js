// @flow
import ensure from "../../utils/ensure";
import getParticipationContract from "../contracts/getParticipationContract";
import gasBoost from "../../utils/gasBoost";

const list = async (subscriber: string) => {
  const participationContract = await getParticipationContract();
  const isListedBefore = await participationContract.avatar(subscriber);
  if (!isListedBefore) {
    const listReceipt = await gasBoost(
      participationContract.list,
      [subscriber],
      {
        from: subscriber,
      },
    );
    const isListed = await participationContract.avatar(subscriber);
    ensure(isListed, "Listing failed", listReceipt);
  }

  return true;
};

export default list;

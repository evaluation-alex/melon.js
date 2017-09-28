import ParticipationJson from "@melonproject/protocol/build/contracts/ParticipationOpen.json";
import RMMakeOrdersJson from "@melonproject/protocol/build/contracts/RMMakeOrders.json";
import SphereJson from "@melonproject/protocol/build/contracts/Sphere.json";
import setup from "../../utils/setup";
import gasBoost from "../../utils/gasBoost";
import findEventInLog from "../../utils/findEventInLog";
import getVersionContract from "../contracts/getVersionContract";

const setupFund = async (portfolioName, from = setup.defaultAccount) => {
  const portfolioSymbol = "MLN-T";
  const portfolioDecimals = 18;
  const participation = ParticipationJson.networks[setup.networkId].address;
  const riskManagement = RMMakeOrdersJson.networks[setup.networkId].address;
  const sphere = SphereJson.networks[setup.networkId].address;
  const managementReward = 0;
  const performanceReward = 0;

  const versionContract = await getVersionContract();

  const params = [
    portfolioName,
    portfolioSymbol,
    portfolioDecimals,
    managementReward,
    performanceReward,
    participation,
    riskManagement,
    sphere,
  ];

  // TODO: As soon setupFund returns a boolean if successful, ensure this
  // const preflight = await versionContract.setupFund.call(...params);

  const receipt = await gasBoost(versionContract.setupFund, params, { from });

  const fundAddedMessage = findEventInLog(
    "FundAdded",
    receipt,
    "Error during fund creation",
  );
  const logArgs = fundAddedMessage.args;

  return {
    id: logArgs.id.toNumber(),
    address: logArgs.fundAddr,
    name: logArgs.name,
    timestamp: new Date(logArgs.atTime.times(1000).toNumber()),
  };
};

export default setupFund;

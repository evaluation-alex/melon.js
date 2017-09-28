import contract from "truffle-contract";
import FundJson from "@melonproject/protocol/build/contracts/Fund.json";

import setup from "../../utils/setup";

const getFundContract = async address => {
  const Fund = contract(FundJson);
  Fund.setProvider(setup.currentProvider);
  return Fund.at(address);
};

export default getFundContract;

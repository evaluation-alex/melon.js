import { daemonAddress } from "../../utils/setup";

/*
  * @param ownerOrDaemon - If set to true, will by default filter for orders by the liquidity provider. If undefined, will not filter for owner. If address specified, will filter for that address.
*/

const filterByAssetPair = (
  baseTokenSymbol,
  quoteTokenSymbol,
  orderType,
  ownerOrDaemon,
) => ({
  isActive: true,
  "buy.symbol": orderType === "sell" ? quoteTokenSymbol : baseTokenSymbol,
  "sell.symbol": orderType === "sell" ? baseTokenSymbol : quoteTokenSymbol,
  owner: ownerOrDaemon === true ? daemonAddress : ownerOrDaemon,
});

export default filterByAssetPair;

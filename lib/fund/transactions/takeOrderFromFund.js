// @flow
import BigNumber from "bignumber.js";

import setup from "../../utils/setup";
import toProcessable from "../../assets/utils/toProcessable";
import getOrder from "../../exchange/calls/getOrder";
import gasBoost from "../../utils/gasBoost";
import getFundContract from "../contracts/getFundContract";

/**
 * Take the order specified by id.
 * @param quantityAsked - The quantity to take from the order. If higher
 *    than the quantity of the order, the order gets executed completely and
 *    the remaining quantity is return.
 */
const takeOrderFromFund = (
  id: number,
  vaultAddress: string,
  quantityAsked: BigNumber,
  from: string = setup.defaultAccount,
) =>
  getOrder(id).then(async order => {
    const fundContract = await getFundContract(vaultAddress);

    // if no quantity specified OR a a specified quantity greater than the selling quantity of the
    // order, execute the full order. Otherwise, execute quantityAsked of the full order.
    const quantity =
      !quantityAsked || quantityAsked.gte(order.sell.howMuch)
        ? order.sell.howMuch
        : quantityAsked;

    const args = [order.id, toProcessable(quantity, order.sell.symbol)];

    const transaction = await gasBoost(fundContract.takeOrder, args, { from });

    // TODO #47
    console.log(
      "TODO: throw error when no logs (order not executed)",
      transaction,
    );

    return transaction
      ? {
          executedQuantity: quantity,
          transaction,
        }
      : null;
  });

export default takeOrderFromFund;

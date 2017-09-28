// @flow
import trace from "./trace";

/**
 * Takes a truffle-method (eg. myContract.myMethod) and estimates the gas
 * consumption and boosts this estimation by the multiplier.
 */
const gasBoost = async (
  method: Function,
  params: Array<any>,
  options: Object,
  multiplier: number = 1.2,
) => {
  const gasEstimation = await method.estimateGas(...params);
  const truffleParams = [
    ...params,
    { ...options, gas: Math.ceil(gasEstimation * multiplier) },
  ];
  trace(`Gas estimated  ${method.name}`, truffleParams);
  return method(...truffleParams);
};

export default gasBoost;

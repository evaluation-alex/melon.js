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
  const gasEstimation = await method.estimateGas(...params, options);
  const enhancedOptions = {
    ...options,
    gas: Math.ceil(gasEstimation * multiplier),
  };
  trace(`Gas estimated ${method.name}: ${gasEstimation}`, {
    params,
    enhancedOptions,
  });
  return method(...params, enhancedOptions);
};

export default gasBoost;

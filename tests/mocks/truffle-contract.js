import BigNumber from "bignumber.js";

import orderBook from "../fixtures/blockChainOrders";
import recentTrades from "../fixtures/recentTrades";

const instance = {
  offers: jest.fn(
    id =>
      new Promise(resolve => {
        resolve(orderBook.find(o => o.id === id).data);
      }),
  ),
  getOrder: jest.fn(
    (consigned, id) =>
      new Promise(resolve => {
        resolve(orderBook.find(o => o.id === id).data);
      }),
  ),
  takeOrder: jest.fn(
    (/* exchange, id, quantity, objects */) =>
      new Promise(resolve => {
        resolve({ transactionHash: "0xBLUB" });
      }),
  ),
  makeOrder: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({ logs: [{ event: "OrderUpdated", args: { id: 1 } }] }),
      ),
  ),
  balanceOf: jest.fn(
    (/* ofAddress */) =>
      new Promise(resolve => {
        resolve(new BigNumber(10000000000000000000));
      }),
  ),
  totalSupply: jest.fn(
    () =>
      new Promise(resolve => {
        resolve(new BigNumber(1000000000000000000000));
      }),
  ),
  transfer: jest.fn(
    (/* toAddress, quantity { from: fromAddress } */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Transfer", args: { id: 1 } }] });
      }),
  ),
  approve: jest.fn(
    (/* toAddress, quantity, { from: fromAddress } */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Approval", args: { id: 1 } }] });
      }),
  ),
  transferFrom: jest.fn(
    (/* fromAddress, toAddress, quantity */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Transfer", args: { id: 1 } }] });
      }),
  ),
  allowance: jest.fn(
    (/* ownerAddress, spenderAddress */) =>
      new Promise(resolve => {
        resolve(new BigNumber(6000000000000000000));
      }),
  ),
  /* universe methods */
  /* **************** */
  numAssignedAssets: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(10))),
  ),
  getMelonAsset: jest.fn(() => new Promise(resolve => resolve("0xMLN"))),
  getReferenceAsset: jest.fn(() => new Promise(resolve => resolve("0xETH"))),
  assetAt: jest.fn(i => new Promise(resolve => resolve(`0xTOKEN_${i}`))),
  exchangeAt: jest.fn(() => new Promise(resolve => resolve("0xEXCHANGE"))),
  priceFeedAt: jest.fn(() => new Promise(resolve => resolve("0xPRICEFEED"))),
  setupFund: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({
          logs: [
            {
              event: "FundAdded",
              args: {
                id: new BigNumber(1),
                fundAddr: "0xVAULT",
                name: "TESTFUND",
                atTime: new BigNumber(723310098),
              },
            },
          ],
        }),
      ),
  ),
  getVault: jest.fn(
    () =>
      new Promise(resolve =>
        resolve([
          "0xVAULT",
          "0xUSER",
          "TESTFUND",
          "MLN-T",
          new BigNumber(18),
          true,
          123,
        ]),
      ),
  ),
  getLastOrderId: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(8))),
  ),
  Trade: jest.fn(() => ({
    get: jest.fn(callback => callback(null, recentTrades)),
  })),
  isActive: jest.fn(() => new Promise(resolve => resolve(true))),
  getOwner: jest.fn(() => new Promise(resolve => resolve("0xUSER"))),
  avatar: jest.fn(() => new Promise(resolve => resolve(true))),
  info: jest.fn(
    () =>
      new Promise(resolve =>
        resolve([
          "0xUSER",
          "Test Fund",
          "MLN-T",
          new BigNumber(18),
          new BigNumber(1505292372),
          new BigNumber(0),
        ]),
      ),
  ),
  getName: jest.fn(() => new Promise(resolve => resolve("Test Fund"))),
  getDecimals: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(18))),
  ),
  getDataFeed: jest.fn(() => new Promise(resolve => resolve("0xDATAFEED"))),
  getExchange: jest.fn(() => new Promise(resolve => resolve("0xSIMPLEMARKET"))),
  getCreationTime: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(1505292372))),
  ),
};

instance.setupFund.estimateGas = jest.fn(() => 650000);
instance.approve.estimateGas = jest.fn(() => 50000);
instance.transferFrom.estimateGas = jest.fn(() => 50000);
instance.transfer.estimateGas = jest.fn(() => 50000);
instance.takeOrder.estimateGas = jest.fn(() => 50000);
instance.makeOrder.estimateGas = jest.fn(() => 50000);

const contract = {
  setProvider: jest.fn(),
  at: jest.fn(() => instance),
  deployed: jest.fn(() => instance),
};

const constructor = jest.fn(() => contract);
constructor.mockInspect = { instance, contract };

export default constructor;

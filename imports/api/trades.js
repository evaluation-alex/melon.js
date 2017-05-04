/* global web3 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import contract from 'truffle-contract';

import AddressList from '/imports/lib/ethereum/address_list';
import specs from '/imports/lib/assets/utils/specs.js';
import ExchangeJson from '/imports/lib/assets/contracts/Exchange.json';


const Exchange = contract(ExchangeJson);
Exchange.setProvider(web3.currentProvider);
const exchangeContract = Exchange.at(AddressList.Exchange);

// COLLECTIONS
const Trades = new Mongo.Collection('Trades');
if (Meteor.isServer) {
  Meteor.publish('trades', () => Trades.find());
}

// COLLECTION METHODS

Trades.watch = () => {
  const trades = exchangeContract.Trade({}, { // eslint-disable-line new-cap
    fromBlock: 0,
    toBlock: 'latest',
  });

  trades.watch(Meteor.bindEnvironment((err, event) => {
    if (err) throw err;

    const {
      buy_which_token: buyWhichToken,
      buy_how_much: buyHowMuch,
      sell_which_token: sellWhichToken,
      sell_how_much: sellHowMuch,
    } = event.args;

    const buyPrecision = specs.getTokenPrecisionByAddress(buyWhichToken);
    const sellPrecision = specs.getTokenPrecisionByAddress(sellWhichToken);

    Trades.upsert({
      transactionHash: event.transactionHash,
    }, {
      transactionHash: event.transactionHash,
      buy: {
        howMuch: buyHowMuch.toNumber(),
        token: buyWhichToken,
        symbol: specs.getTokenSymbolByAddress(buyWhichToken),
        precision: buyPrecision,
        price: (buyHowMuch / sellHowMuch) * Math.pow(10, sellPrecision - buyPrecision),
      },
      sell: {
        howMuch: sellHowMuch.toNumber(),
        token: sellWhichToken,
        symbol: specs.getTokenSymbolByAddress(sellWhichToken),
        precision: sellPrecision,
        price: (sellHowMuch / buyHowMuch) * Math.pow(10, buyPrecision - sellPrecision),
      },
    });
  }));
};


export default Trades;

/* Trade Shape:
{
   address: '0xe4183415d59f0a619654fa1d9898472c5ea852ab',
   blockHash: '0x261506db8f20b4f5e6b79470636fdae502601bf21a2943e62e489857e656bee4',
   blockNumber: 1228905,
   logIndex: 2,
   transactionHash: '0xbe0a06d86dc3ccec0d4278af30e5cbb2995eef427c736d71636ecfe664d0db17',
   transactionIndex: 0,
   transactionLogIndex: '0x2',
   type: 'mined',
   event: 'Trade',
   args:
    { sell_how_much: { [String: '1000000000000000000'] s: 1, e: 18, c: [Object] },
      sell_which_token: '0x7506c7bfed179254265d443856ef9bda19221cd7',
      buy_how_much: { [String: '1980000000000000000'] s: 1, e: 18, c: [Object] },
      buy_which_token: '0x4dffea52b0b4b48c71385ae25de41ce6ad0dd5a7' } }
*/

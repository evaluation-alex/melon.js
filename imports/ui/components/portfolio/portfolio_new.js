import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { BigNumber } from 'web3';
// Collections
import { Portfolios } from '/imports/api/portfolios.js';

// Load Truffle artifact
import Core from '/imports/lib/assets/contracts/Core.sol.js';

import './portfolio_new.html';


Template.portfolio_new.onCreated(() => {
  Meteor.subscribe('portfolios');
  Template.instance().state = new ReactiveDict();
  Template.instance().state.set({ isInactive: true });
});


Template.portfolio_new.helpers({
  isError() {
    return Template.instance().state.get('isError');
  },
  isMining() {
    return Template.instance().state.get('isMining');
  },
  isMined() {
    return Template.instance().state.get('isMined');
  },
  address() {
    return Template.instance().state.get('address');
  },
  isCreated() {
    return Template.instance().state.get('isCreated');
  },
  isInactive() {
    return Template.instance().state.get('isInactive');
  },
  source() {
    return Core.abi;
  },
});

Template.portfolio_new.onRendered(() => {
  this.$('select').material_select();
});


Template.portfolio_new.events({
  'submit .new-portfolio'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();

    // Init Reactive Dict
    const reactiveState = Template.instance().state;

    // Get value from form element
    const target = event.target;
    const manager_name = target.manager_name.value;
    const portfolio_name = target.portfolio_name.value;

    // Clear form
    target.manager_name.value = '';
    target.portfolio_name.value = '';

    reactiveState.set({ isInactive: false, isMining: true });

    // Creation of contract object
    Core.setProvider(web3.currentProvider);
    const manager_address = Session.get('clientDefaultAccount');
    const gasPrice = 100000000000;
    const gas = 2500000;

    Core.new(
      '0x0B2D33E8a261D2481E3860C8ea9B073a740D32c8',
      '0x0',
      '0x0',
      0,
      // TODO: fix address
      { from: web3.eth.accounts[0], gasPrice, gas }
    ).then((result, err) => {
      if (err) {
        reactiveState.set({ isMining: false, isError: true, error: String(err) });
      }
      if (result.address) {
        reactiveState.set({ isMining: false, isMined: true, address: result.address });
        // Insert a portfolio into the Collection
        const sharePrice = 1.0;
        const notional = 0;
        const intraday = 1.0;
        const mtd = 1.0;
        const ytd = 1.0;
        Meteor.call(
          'portfolios.insert', result.address, manager_address,
          portfolio_name, sharePrice, notional, intraday, mtd, ytd
        );
      }
    });
    reactiveState.set({ isMining: false, isMined: true, address: '0x0' });
    // Insert a portfolio into the Collection
    const sharePrice = 1.0;
    const notional = 0;
    const intraday = 1.0;
    const mtd = 1.0;
    const ytd = 1.0;
    Meteor.call(
      'portfolios.insert', '0x0', portfolio_name, manager_address, manager_name,
      sharePrice, notional, intraday, mtd, ytd
    );
  },
});

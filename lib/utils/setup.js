const setup = {
  init({ web3, daemonAddress, defaultAccount, tracer = () => {} }) {
    this.web3 = web3;
    this.currentProvider = web3.currentProvider;
    this.networkId = web3.version.network;
    this.defaultAccount =
      defaultAccount || web3.eth.defaultAccount || web3.eth.accounts[0];
    this.daemonAddress = daemonAddress;
    this.tracer = tracer || console.log;
  },
};

export default setup;

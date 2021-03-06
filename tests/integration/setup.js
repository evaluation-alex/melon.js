import Web3 from "web3";
import setup from "../../lib/utils/setup";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

try {
  setup.init({
    web3,
    daemonAddress: "0x00360d2b7d240ec0643b6d819ba81a09e40e5bcd",
    defaultAccount: "0xfc669feb5c9a551bea36729f8f4193929a44871d",
    tracer: ({ timestamp, message, category }) => {
      console.log(timestamp.toISOString(), `[${category}]`, message);
    },
  });
} catch (e) {
  console.error(
    "Cannot setup melon.js. Are you running a local ethereum node at http://localhost:8545 ?",
  );
}

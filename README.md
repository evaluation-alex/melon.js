![Melon.js Logo](/docs/media/melonjs-500.png?raw=true)

Melon.js
========

A convenient Javascript interface to the Melon protocol Ethereum smart contracts.

[![Gitter][gitter-badge]][gitter-url]
[![License: GPL v3][license-badge]][license-badge-url]
[![Dependencies][dependencies-badge]][dependencies-badge-url]
[![Dev Dependencies][devDependencies-badge]][devDependencies-badge-url]
[![NSP Status][NSP Status badge]][NSP Status]

## Principles

- Functional programming:
  - Types with Flow-Type
  - Composition over inheritance
  - TODO: Do not throw exceptions. Use [railways](http://fsharpforfunandprofit.com/rop/) instead.
- Abstract token decimals problem: This library consumes and returns always
  quantities as a [BigNumber] with decimals included. I.e. "12.23" and not 
  "1200000000000" (number of 0s depending on the token decimals)
- Abstract token address problem: Always consume and return tokens in their 
  symbol name instead of address.

## Usage

To use melon.js, you need to set it up with web3 and the daemon address. For now,
examples are for a Meteor setup. But it's similar on other setups.

### Server

Be sure that the following lines are executed before any other usage of
melon.js

```javascript
// /imports/startup/server/index.js
import Web3 from 'web3';
import { setup } from '@melonproject/melon.js';

const web3 = new Web3(
  new Web3.providers.HttpProvider(Meteor.settings.private.JSON_RPC_URL),
);

// before Meteor.startup
setup.init({ web3, daemonAddress: Meteor.settings.public.DAEMON_ADDRESS });
```

### Client

On the client, it is a bit more tricky. The setup should be executed after
web3.js is injected but before other usage of melon.js:

```javascript
// /imports/startup/client/config.js
import Web3 from 'web3';
import { setup } from '@melonproject/melon.js';

Meteor.startup(() => {
  // as first statement inside Meteor.startup
  setup.init({ web3, daemonAddress: Meteor.settings.public.DAEMON_ADDRESS });
  
  // ... other setup commands
});
```

### Error logging / Tracing
It is possible to setup error logging with the tracing functionality. Here is an example for sentry/raven:

```javascript
import flatten from 'flat';
import raven from 'raven';
import { setup } from '@melonproject/melon.js';

Raven.config(SENTRY_DSN).install();

setup.init({ web3, tracer: ({ timestamp, message, category, data }) => {
  Raven.captureBreadcrumb({ message, category, data: flatten(data)})
}});
```

### Link dev build

To use the latest version of melon.js and to further develop it in place,
it can be linked:

```bash
git clone git@github.com:melonproject/melon.js.git
cd melon.js
npm install
npm run build
npm link
cd ../portal
npm link @melonproject/melon.js
```

If you make changes to the source files (in `lib/` folder), you need to
build it again before they are usable in the dependent project:
```bash
npm run build
```

## Folder structure

The folder structure is based on the structure of the 
[protocol contract]. That said, the melon.js has a different
goal: Making interaction with the protocol as developer friendly as possible.
Whereas the protocol needs to be efficient on the blockchain and secure.


### `/`
The shape of this repository is inspired by [this blogpost][hacker noon react lib].
On the root level, there are the common configuration files like `package.json`,
`.eslintrc`, ...

And three important folders:

- `lib/`: The ES6/7 source code
- `build/`: The transpiled ES5 code (ignored in git)
- `test/`: Integration tests, unit tests, mocks, common fixtures and package 
  wide test helpers
- `docs/`: Autogenerated docs with [esdoc]. (TODO)


### `lib/`
This is probably the most interesting folder. Here is the actual code. The 
structure mirrors the [protocol contract] (i.e. `assets/`, `exchange/`, ...),
adding only `utils/` for common utility functions.

### `lib/[contract]`
Each of these contract folders can have the following subfolders:

- `calls/`: Actual interactions with the blockchain free of gas.
  So called constant-methods.
- `transactions/`: Actual interactions with the blockchain that cost gase. 
  So called non-constant-methods.
- `events/`: Watch & get events 
- `contracts/`: Helpers to get instances of the deployed contracts. Meant for 
  internal use. 
- `utils/`: Utility functions to interact with the data
- `queries/`: Sort and filter functions to insert into JS own `.sort(fn)`,
  `.filter(fn)`.

Note: Some calls & transactions are more or less a simple JS-wrapper on the
contract, where others do more complex stuff and even combine multiple calls
to the contracts. But you can be certain: Calls are free.

## `testing`

By interacting with the smart contracts, we have 2 levels of testing:

- `tests/unit/` Jest Unit-tests: Each function as isolated as possible with mocks.
  We are not super strict here and allow that one unit depends on another as
  long as the interaction with the smart contracts is mocked. The unit test
  directory reflects the structure of the lib directory.
- `tests/integration/` Jasemine Integration tests: Interact with real smart contracts.
  Be careful with those: They connect to a real unlocked node that you need to set up (see below).
- `tests/shared/` Shared expectations. Since Jest & Jasemine have very similar 
  syntax, some test-expectations (`expect(asdf).to...`) can be isolated in 
  separate functions and shared.

### Set up unlocked parity account
- run `parity account new --chain kovan`
- Type a password; don't forget to store that password carefully, along with the generated account address.
- Create a new file called "account" and paste the password in.
- In the same folder, create a file called "run.sh". Copy and paste the following command in this file, and replace accordingly with your account address.

`parity --chain kovan --author YOURACCOUNTADDRESS --unlock YOURACCOUNTADDRESS --password ./account --auto-update=all --geth --force-ui`

- Back to the terminal, make this new file executable by running: `chmod 755 run.sh`

[gitter-badge]: https://img.shields.io/gitter/room/melonproject/general.js.svg?style=flat-square
[gitter-url]: https://gitter.im/melonproject/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[license-badge]: https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=flat-square
[license-badge-url]: ./LICENSE
[dependencies-badge]: https://img.shields.io/david/melonproject/melon.js.svg?style=flat-square
[dependencies-badge-url]: https://david-dm.org/melonproject/melon.js
[devDependencies-badge]: https://img.shields.io/david/dev/melonproject/melon.js.svg?style=flat-square
[devDependencies-badge-url]: https://david-dm.org/melonproject/portal#info=devDependencies
[NSP Status badge]: https://nodesecurity.io/orgs/melonproject/projects/cb1dd04e-1069-4ffd-8210-70ec757ed3de/badge?style=flat-square
[NSP Status]: https://nodesecurity.io/orgs/melonproject/projects/cb1dd04e-1069-4ffd-8210-70ec757ed3de

[BigNumber]: https://mikemcl.github.io/bignumber.js/
[protocol contract]: https://github.com/melonproject/protocol/tree/master/contracts
[hacker noon react lib]: https://hackernoon.com/building-a-react-component-library-part-1-d8a1e248fe6c
[esdoc]: https://esdoc.org/

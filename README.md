# Web3 Boilerplate

This boilerplate is made of Hardhat for smart contract development. The front-end is made of NEXT.JS, Tailwind, and ethers.js.

Contract deployed to: ```0x0F3030123D5A2597ef0c356248954fC237645AB7```

To use this template, follow these steps:

```
clone repo
create .env from .env.example
yarn
```

To run the frontend use:

```
yarn dev
```

To deploy this contract use:

```
npx hardhat run scripts/deploy.js --network NETWORK_NAME
```

To verify smart contract use: 

```
npx hardhat verify --network rinkeby CONTRACT_ADDRESS --constructor-args arguments.js 
```

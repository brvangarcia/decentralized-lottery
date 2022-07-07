# Smart contract Lottery

Using Solidity, Chainlink VRF and Keepers. 

Contract deployed to: ```0x96040feB1A8400906E4C86Bc0795eDd8592D3622```

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

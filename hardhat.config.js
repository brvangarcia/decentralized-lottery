require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `${process.env.RINKEBY_ALCHEMY_URL}`,
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY}`],
    },
   
  },
  etherscan: {
    apiKey: {
      rinkeby:`${process.env.RINKEBY_ETHERSCAN_KEY}`
    },
    customChains: [
      {
        network: "rinkeby",
        chainId: 4,
        urls: {
          apiURL: "https://api-rinkeby.etherscan.io/api",
          browserURL: "https://rinkeby.etherscan.io"
        }
      }
    ]
  }
};
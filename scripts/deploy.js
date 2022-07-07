const main = async () => {
  const Lottery = await ethers.getContractFactory("Lottery");
  const contract = await Lottery.deploy("0x409CF388DaB66275dA3e44005D182c12EeAa12A0","100000000000000000","0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", "7755" ,"500000", "30",  );
  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

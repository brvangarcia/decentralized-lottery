const main = async () => {
  const Greeter = await ethers.getContractFactory("Greeter");
  const contract = await Greeter.deploy();
  await contract.deployed();
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

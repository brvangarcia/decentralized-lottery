import { ethers } from "ethers";

 const useContract = async (Address, Abi, Provider) => {
    return new ethers.Contract(Address, Abi.abi, Provider)
}

export {useContract};
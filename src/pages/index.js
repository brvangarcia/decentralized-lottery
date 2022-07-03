/* eslint-disable react-hooks/rules-of-hooks */
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Abi from "../contracts/Greeter.abi";
import Address from "../contracts/Greeter.address";
import { useContract } from "../hooks/useContract";

export default function Home() {
  const [active, setActive] = useState(false);
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [greeting, setGreeting] = useState("");
  const [inputGreeting, setInputGreeting] = useState("");

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setProvider(provider);
    setSigner(signer);
    setActive(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callGetGreeter = async () => {
    if (!provider) return;

    const contract = await useContract(Address, Abi, provider);

    const greet = await contract.getGreet();
    setGreeting(greet);
  };

  useEffect(() => {
    connectWallet();
   
  }, []);

  useEffect(() => {
    callGetGreeter();
  }, [callGetGreeter, signer]);

  

  const callSetGreeter = async () => {
    if (!signer) return;

    const contract = await useContract(Address, Abi, signer);

    await contract.setGreeting(inputGreeting);
    setGreeting(inputGreeting);
  };

  return (
    <div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Web3 Boilerplate</span>
            <span className="block">Start using it today.</span>
          </h2>

          <div>
            {active && (
              <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Greeter value is:
                        </label>
                        <div className="mt-1">
                          <p className="appearance-none block w-full px-3 py-2  rounded-md  placeholder-gray-400  sm:text-sm">
                            {greeting}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="greeter"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Set greeter
                        </label>
                        <div className="mt-1">
                          <input
                            id="greeter"
                            name="greeter"
                            type="text"
                            onChange={(e) => setInputGreeting(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={callSetGreeter}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Set Greeter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */
import Header from "../components/Header";

import { useMoralis } from "react-moralis";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  return (
    <div>
      <Header />

      <div className="flex jusitify-center">
        {isWeb3Enabled ? (
          <div className="mx-auto">
            {"4".includes(parseInt(chainId).toString()) ? (
              <div className="flex flex-row ">
                <LotteryEntrance className="p-8" />
              </div>
            ) : (
              <div>
                Please switch to Rinkeby.
              </div>
            )}
          </div>
        ) : (
          <div>Please connect to a Wallet</div>
        )}
      </div>
    </div>
  );
}

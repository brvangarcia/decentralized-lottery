import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex justify-between p-5 ">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 text-xl">Smart contract lottery</span>
        </a>

        <ConnectButton moralisAuth={false} />
      </div>
    </header>
  );
}

import "./App.css";
import { TokenLaunchpad } from "./components/TokenLaunchpad";
// wallet adapter imports
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";

function App() {

  const wallet=useWallet();
  console.log(wallet.publicKey,"hii")
const [dis,setDis]=useState(0);
  useEffect(()=>{
if(wallet.publicKey==null)setDis(0);
else setDis(1)

console.log("gg")
  },[wallet.publicKey])
  return (
    <div className="bg-slate-800 h-screen w-screen flex flex-col items-center justify-center">
      <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={[]}>
          <WalletModalProvider>
            <div className="flex space-x-4 mb-6 my-7">
              <WalletMultiButton className="!bg-blue-500 !text-white !py-2 !px-4 !rounded-md" />
              {(<WalletDisconnectButton className="!bg-red-500 !text-white !py-2 !px-4 !rounded-md" />)}
            </div>
            <TokenLaunchpad />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;

"use client";
import Image from "next/image";
import NearWallet from "../../../../package/network/near_wallet";
import { useState, useEffect } from "react";
import { NetworkID } from "../../../../package/models/near_models";

export default function Home() {
  const [nearWallet, setNearWallet] = useState<NearWallet | null>(null);

  useEffect(() => {
    const walletInstance = NearWallet.getInstance();
    setNearWallet(walletInstance);
  }, []);

  useEffect(() => {
    if (nearWallet) {
      console.log(nearWallet);
    }
  }, [nearWallet]);

  async function connectToWallet() {
    try {
      if (nearWallet) {
        const test = await nearWallet.createWalletConnection({
          networkID: NetworkID.testnet,
        });
        console.log(test);
      } else {
        throw new Error("nearWallet not load");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function check(): Promise<boolean> {
    const test = await nearWallet.checkIsSign();
    console.log(test);
    return test;
  }

  return (
    <div>
      <button
        onClick={async () => {
          await connectToWallet();
        }}
        className="button"
      >
        test
      </button>
      <button
        onClick={async () => {
          await check();
        }}
        className="button"
      >
        check
      </button>
    </div>
  );
}

"use client";
import Image from "next/image";
import NearWallet from "../../../../package/network/near_wallet";
import { useState, useEffect } from "react";
import { NetworkID } from "../../../../package/models/near_models";
import DaoService from "../../../../package/service/dao_service";
// import DaoManagerJS from "DaoManagerJS";
export default function Home() {
  const [nearWallet, setNearWallet] = useState<NearWallet | null>(null);
  const [daoService, setDaoService] = useState<DaoService | null>(null);

  useEffect(() => {
    const walletInstance = NearWallet.getInstance();
    setNearWallet(walletInstance);
    const daoInstance = DaoService.getInstance();
    setDaoService(daoInstance);
  }, []);

  useEffect(() => {
    if (nearWallet) {
      console.log(nearWallet);
    }
    console.log(daoService);
  }, [nearWallet, daoService]);

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

  async function testNFT() {
    const resp = await nearWallet.newCallSmartContractFunc({
      contractId: "mintspace2.testnet",
      methodName: "create_store",
      deposit: "3700000000000000000000000",
      args: {
        owner_id: "maierr.testnet",
      },
    });
    console.log(resp);
  }

  async function create() {
    const test = await daoService.createDaoMeneger({
      name: "daotest",
      purpose: "Maier Corp",
      policy: ["maierr.testnet"],
    });
  }

  async function checkTxns() {
    const check = await nearWallet.getTxnsHeshStatus({
      txnHesh: "6Cic1sM2KjKgee7xNsppEQr37y2vRh8cz5gdcpL9PnDM",
      accountId: "maierr.testnet",
    });
    console.log(check);
  }

  async function policy() {
    await daoService.getPolicy({ contractId: "daotest.sputnik-v2.testnet" });
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
      <button
        onClick={async () => {
          await testNFT();
        }}
        className="button"
      >
        smart
      </button>
      <button
        onClick={async () => {
          await create();
        }}
        className="button"
      >
        create
      </button>
      <button
        onClick={async () => {
          await checkTxns();
        }}
        className="button"
      >
        txn
      </button>
      <button
        onClick={async () => {
          await policy();
        }}
        className="button"
      >
        policy
      </button>
    </div>
  );
}

"use client";
import NearWallet from "../../../../package/network/near_wallet";
import { useState, useEffect, use } from "react";
import { NetworkID } from "../../../../package/models/near_models";
import DaoService from "../../../../package/service/dao_service";
import CustomButton from "../shared_widgets/custom_button";
import { useRouter } from "next/compat/router";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
// import DaoManagerJS from "DaoManagerJS";
export default function Home() {
  const router = useRouter();
  const [nearWallet, setNearWallet] = useState<NearWallet | null>(null);
  const [daoService, setDaoService] = useState<DaoService | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  useEffect(() => {
    const walletInstance = NearWallet.getInstance();
    setNearWallet(walletInstance);

    const daoInstance = DaoService.getInstance();
    setDaoService(daoInstance);
  }, []);

  useEffect(() => {
    const init = async () => {
      await connectToWallet();
      const isLogin = await checkIsLogIn();
      if (isLogin == true) {
        router.push(UrlDashboard.profile);
      }
    };
    if (nearWallet) init();
  }, [router, nearWallet]);

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

  async function checkIsLogIn(): Promise<boolean> {
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
    <div className="centered-container">
      <h1 className="text-4xl font-bold">Welcome to DAO MANAGER</h1>
      <CustomButton
        text="Log In"
        onClick={async () => {
          await connectToWallet();
        }}
        style={{ fontSize: "25px" }}
      />
      {/* <button
        onClick={async () => {
          await checkIsLogIn();
        }}
        className="button"
      >
        check
      </button> */}
      {/* <Button
        color="primary"
        onClick={async () => {
          await testNFT();
        }}
      >
        smart
      </Button>
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
      </button> */}
    </div>
  );
}

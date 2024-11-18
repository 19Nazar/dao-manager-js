"use client";
import { use, useEffect } from "react";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter } from "next/navigation";
import { NetworkID } from "../../../../../package/models/near_models";

export default function Profile() {
  const router = useRouter();
  const daoManagerJS = DaoManagerJS.getInstance();

  const network = localStorage.getItem("network");
  if (network == "mainnet") {
    daoManagerJS.createWalletConnection({ networkID: NetworkID.mainnet });
  } else if (network == "testnet") {
    daoManagerJS.createWalletConnection({ networkID: NetworkID.testnet });
  } else {
    throw new Error("You need login");
  }

  useEffect(() => {
    const res = daoManagerJS.nearWallet.checkIsSign();
    console.log(res);
  }, [daoManagerJS]);

  function logOut() {
    daoManagerJS.signOut();
    localStorage.removeItem("network");
    router.push("/login");
  }

  async function test() {
    await daoManagerJS.nearWallet.test();
  }

  return (
    <div>
      <CustomButton
        text="Log Out"
        onClick={() => {
          logOut();
        }}
      />
      <CustomButton
        text="test"
        onClick={async () => {
          await test();
        }}
      />
    </div>
  );
}

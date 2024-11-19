"use client";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";
import { useState, useEffect, use } from "react";
import { NetworkID } from "../../../../package/models/near_models";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { Spinner } from "@nextui-org/react";
import { color } from "framer-motion";
// import DaoManagerJS from "DaoManagerJS";

export default function Home() {
  const walletInstance = DaoManagerJS.getInstance();
  const router = useRouter();

  useEffect(() => {
    // console.log("test");
    // async function load() {
    //   if (walletInstance) {
    //     await loading();
    //   }
    // }
    // load();
    router.push("/login");
  }, [router]); // Убираем `nearWallet` из зависимостей, чтобы избежать бесконечного рендера

  // async function connectToWallet() {
  //   try {
  //     if (walletInstance) {
  //       const test = await walletInstance.createWalletConnection({
  //         networkID: NetworkID.testnet,
  //       });
  //       console.log(test);
  //     } else {
  //       throw new Error("NearWallet not loaded");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  async function checkIsLogIn(): Promise<boolean> {
    if (!walletInstance) {
      console.error("NearWallet is not initialized");
      return false;
    }
    const test = await walletInstance.checkIsSign();
    console.log(test);
    return test;
  }

  // async function loading() {
  //   if (!walletInstance) {
  //     console.error("NearWallet is not initialized");
  //     return;
  //   }
  //   await connectToWallet();
  //   const isLogin = await checkIsLogIn();
  //   if (isLogin) {
  //     router.push("/profile");
  //   } else {
  //     router.push("/login");
  //   }
  // }

  return (
    <div className="centered-container">
      <Spinner
        label="Loading..."
        color="warning"
        style={{ color: "#a463b0" }}
      />
    </div>
  );
}

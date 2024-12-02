"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { Spinner } from "@nextui-org/react";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";
import {
  ConnectionType,
  NetworkID,
} from "../../../../package/models/near_models";
// import DaoManagerJS from "DaoManagerJS";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const network = localStorage.getItem("network");

      if (network) {
        const daoManager = DaoManagerJS.getInstance();
        await daoManager.createConnection({
          connectionType: ConnectionType.wallet,
          networkID:
            network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
        });
        const isAuth = await daoManager.checkIsSign();
        if (isAuth) {
          router.push(UrlDashboard.profile);
        } else {
          router.push(UrlDashboard.login);
        }
      } else {
        router.push(UrlDashboard.login);
      }
    }
    checkAuth();
  }, [router]);

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

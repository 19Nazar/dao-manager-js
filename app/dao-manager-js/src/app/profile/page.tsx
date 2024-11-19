"use client";
import { useEffect } from "react";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter } from "next/navigation";
import {
  ConnectionType,
  NetworkID,
} from "../../../../../package/models/near_models";
import { UrlDashboard } from "../../url_dashboard/url_dashboard";

export default function Profile() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();

  if (!typeConnection) {
    router.push(UrlDashboard.login);
  } else if (typeConnection == "wallet") {
    daoManagerJS.createConnection({
      connectionType: ConnectionType.wallet,
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
    });
  } else if (typeConnection == "default") {
  }

  function logOut() {
    daoManagerJS.signOut();
    localStorage.removeItem("network");
    localStorage.removeItem("connection");
    router.push(UrlDashboard.login);
  }

  return (
    <div>
      <CustomButton
        text="Log Out"
        onClick={() => {
          logOut();
        }}
      />
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import { UrlDashboard } from "../../../url_dashboard/url_dashboard";
import {
  ConnectionType,
  NetworkID,
} from "../../../../../../package/models/near_models";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ConstantsDashboard } from "../../../const/const";

export default function CreateDao() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);

  const [settings, setSettings] = useState<object | null>(null);

  if (!typeConnection) {
    router.push(UrlDashboard.login);
  } else if (typeConnection == "wallet") {
    daoManagerJS.createConnection({
      connectionType: ConnectionType.wallet,
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
    });
  } else if (typeConnection == "default") {
    if (!dataDefault) {
      throw new Error("You need login correctly");
    }
    const data = JSON.parse(dataDefault);
    daoManagerJS.createConnection({
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      connectionType: ConnectionType.default,
      accountID: data.accountId,
      privateKey: data.key,
    });
  } else {
    throw new Error("You need log in correctly");
  }

  function RenderObject({ data }) {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? (
                <RenderObject data={value} />
              ) : (
                value.toString()
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{data}</span>;
  }

  useEffect(() => {
    async function getSettings(contractId: string) {
      const settings = await daoManagerJS.getPolicy({ contractId: contractId });
      setSettings(settings.data);
    }
    if (daoID) {
      getSettings(daoID);
    }
  }, []);

  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">DAO setting</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                {!daoID ? (
                  <h1>For Interaction you must add DAO smart contract id</h1>
                ) : (
                  <RenderObject data={settings} />
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

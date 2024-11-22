"use client";
import { useEffect, useState } from "react";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import { Utils } from "../../../../../package/index";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter } from "next/navigation";
import {
  ConnectionType,
  NetworkID,
} from "../../../../../package/models/near_models";
import { UrlDashboard } from "../../url_dashboard/url_dashboard";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from "@nextui-org/react";
import styles from "../style/profile.module.css";
import { color } from "framer-motion";
import NavbarComponent from "../../shared_widgets/navbar";
import { ConstantsDashboard } from "../../const/const";

export default function Profile() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const [accountID, setAccountID] = useState<string>("");
  const [isAdd, setIsAdd] = useState<boolean | null>(null);

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

  useEffect(() => {
    document.body.classList.add(styles.body_profile);

    return () => {
      document.body.classList.remove(styles.body_profile);
    };
  }, []);

  function addDaoID(accountId: string) {
    localStorage.setItem(ConstantsDashboard.daoId, accountId);
    setIsAdd(true);
  }

  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">DAO init</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h1>
                  If you have not created a DAO yet, go to create DAO section
                </h1>
                <h1>
                  Input DAO contract id for interact with in (you must have
                  appropriate privileges)
                </h1>
                <Input
                  className="mt-5"
                  autoFocus
                  label="Account id DAO"
                  placeholder="Enter account id for DAO"
                  variant="bordered"
                  value={accountID}
                  onChange={(e) => setAccountID(e.target.value)}
                />
                <CustomButton
                  style={{ marginTop: 10 }}
                  text={"Add DAO id"}
                  onClick={() => {
                    addDaoID(accountID);
                  }}
                />
                <h1 style={{ textAlign: "center" }}>
                  {isAdd ? isAdd.toString() : ""}
                </h1>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

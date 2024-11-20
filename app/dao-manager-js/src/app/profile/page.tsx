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

export default function Profile() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const [accountId, setAccountId] = useState<string | null>();
  const [balance, setBalance] = useState<string | null>();

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
    const fetchBalance = async () => {
      const accountId = localStorage.getItem("my-app_wallet_auth_key")
        ? JSON.parse(localStorage.getItem("my-app_wallet_auth_key")).accountId
        : JSON.parse(dataDefault).accountId;
      setAccountId(accountId);

      try {
        await upadateBalance(accountId);
      } catch (error) {
        console.error("Error while gat balance:", error);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    document.body.classList.add(styles.body_profile);

    return () => {
      document.body.classList.remove(styles.body_profile);
    };
  }, []);

  async function upadateBalance(accountId: string) {
    const balanceYoctoNear = await daoManagerJS.getBalance({
      accountId: accountId,
    });
    const balanceNear = Utils.yoctoNEARToNear(balanceYoctoNear);
    setBalance(balanceNear);
  }

  function logOut() {
    daoManagerJS.signOut();
    localStorage.removeItem("network");
    localStorage.removeItem("connection");
    if (localStorage.getItem("app_default_auth_key")) {
      localStorage.removeItem("app_default_auth_key");
    }
    router.push(UrlDashboard.login);
  }

  const menuItems = ["test"];

  return (
    <div>
      <div className={styles.navBar}>
        <Navbar disableAnimation isBordered>
          <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarContent className="sm:hidden pr-3" justify="center">
            <NavbarBrand>
              <p className="font-bold text-inherit color-white">DAO-MANAGER</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent
            className="hidden sm:flex justify-center"
            justify="start"
          >
            <NavbarBrand>
              <p className="font-bold text-inherit">DAO-MANAGER</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="#">
                Create DAO
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" aria-current="page" color="foreground">
                Add Proposal
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                Settings DAO
              </Link>
            </NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end">
            <NavbarContent
              className="hidden sm:flex flex-col justify-center"
              justify="end"
            >
              <NavbarItem>
                {accountId?.length > 20
                  ? `${accountId?.slice(0, 20)}...`
                  : accountId}
              </NavbarItem>
              <NavbarItem>
                {balance?.length > 20 ? `${balance?.slice(0, 20)}...` : balance}
              </NavbarItem>
            </NavbarContent>
            <NavbarItem>
              <Button className={styles.appBarButtonColor} onClick={logOut}>
                Log Out
              </Button>
            </NavbarItem>
          </NavbarContent>

          <NavbarMenu className={styles.navBar}>
            <NavbarMenuItem>
              <Link color="foreground" href="#">
                Create DAO
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              {" "}
              <Link href="#" aria-current="page" color="foreground">
                Add Proposal
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link color="foreground" href="#">
                Settings DAO
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              Account ID:
              {accountId?.length > 20
                ? `${accountId?.slice(0, 20)}...`
                : accountId}
            </NavbarMenuItem>
            <NavbarMenuItem>
              Balance:
              {balance?.length > 20 ? `${balance?.slice(0, 20)}...` : balance}
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>
      </div>
      <div>тест</div>
    </div>
  );
}

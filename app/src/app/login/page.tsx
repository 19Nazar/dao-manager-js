"use client";
import { useState } from "react";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../../url_dashboard/url_dashboard";
import styles from "../style/login.module.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { ConnectionType, DaoManagerJS, NetworkID } from "dao-manager-js";

export default function Home() {
  const router = useRouter();
  const daoManagerInstance = DaoManagerJS.getInstance();
  const [selectedKey, setSelectedKey] = useState<string>("testnet");

  async function logInWallet({ network }: { network: string }) {
    await daoManagerInstance.createConnection({
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      connectionType: ConnectionType.wallet,
    });
    localStorage.setItem("network", network);
    const isLogIn = await daoManagerInstance.checkIsSign();
    if (isLogIn == true) {
      router.push(UrlDashboard.profile);
    } else {
      const currentUrl = window.location.origin;
      await daoManagerInstance.logIn({
        successUrl: `${currentUrl}${UrlDashboard.profile}`, // Используем актуальный URL
        failureUrl: `${currentUrl}${UrlDashboard.login}`, // Используем актуальный URL
      });
    }
  }

  return (
    <div>
      <div className={styles.top_right_container}>
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Button className="bg-white" variant="bordered">
              {selectedKey}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Network Selection"
            variant="faded"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKey}
            onSelectionChange={(keys) => setSelectedKey(keys.currentKey)}
          >
            <DropdownItem key="testnet">testnet</DropdownItem>
            <DropdownItem key="mainnet">mainnet</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="centered-container">
        <div className="m-10">
          <h1 className="text-4xl font-bold">Welcome to DAO MANAGER</h1>
        </div>
        <CustomButton
          text="Log In By Wallet"
          onClick={async () => {
            await logInWallet({ network: selectedKey });
          }}
          style={{ fontSize: "25px" }}
        />
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, use, useMemo } from "react";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter, usePathname } from "next/navigation";
import { UrlDashboard } from "../../url_dashboard/url_dashboard";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import styles from "../style/login.module.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
// import DaoManagerJS from "DaoManagerJS";
export default function Home() {
  const router = useRouter();
  const path = usePathname();
  const walletInstance = DaoManagerJS.getInstance();
  const [selectedKey, setSelectedKey] = useState<string>("testnet");

  useEffect(() => {
    console.log(path);
  }, [path]);

  async function logIn({ network }: { network: string }) {
    localStorage.setItem("network", network);
    const res = await walletInstance.logIn({
      successUrl: UrlDashboard.url + UrlDashboard.profile,
      failureUrl: UrlDashboard.url + UrlDashboard.login,
    });
  }

  // async function create() {
  //   const test = await daoService.createDaoMeneger({
  //     name: "daotest",
  //     purpose: "Maier Corp",
  //     policy: ["maierr.testnet"],
  //   });
  // }

  // async function checkTxns() {
  //   const check = await nearWallet.getTxnsHeshStatus({
  //     txnHesh: "6Cic1sM2KjKgee7xNsppEQr37y2vRh8cz5gdcpL9PnDM",
  //     accountId: "maierr.testnet",
  //   });
  //   console.log(check);
  // }

  // async function policy() {
  //   await daoService.getPolicy({ contractId: "daotest.sputnik-v2.testnet" });
  // }

  return (
    <div>
      <div className={styles.top_right_container}>
        <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Button variant="bordered">{selectedKey}</Button>
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
        <h1 className="text-4xl font-bold">Welcome to DAO MANAGER</h1>
        <CustomButton
          text="Log In"
          onClick={async () => {
            await logIn({ network: selectedKey });
          }}
          style={{ fontSize: "25px" }}
        />
      </div>
    </div>
  );
}

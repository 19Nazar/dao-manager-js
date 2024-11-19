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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from "@nextui-org/react";
import { NetworkID, ConnectionType } from "../../../../../package/index";

export default function Home() {
  const router = useRouter();
  const path = usePathname();
  const daoManagerInstance = DaoManagerJS.getInstance();
  const [selectedKey, setSelectedKey] = useState<string>("testnet");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [accountId, setAccountId] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    console.log(path);
  }, [path]);

  async function logInWallet({ network }: { network: string }) {
    await daoManagerInstance.createConnection({
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      connectionType: ConnectionType.wallet,
    });
    localStorage.setItem("network", network);
    localStorage.setItem("connection", "wallet");
    await daoManagerInstance.logIn({
      successUrl: UrlDashboard.url + UrlDashboard.profile,
      failureUrl: UrlDashboard.url + UrlDashboard.login,
    });
    router.push(UrlDashboard.profile);
  }

  //cerate modal window
  async function logInDefault({ network }: { network: string }) {
    if (privateKey.length == 0 || accountId.length == 0) {
      throw new Error("Input accountId and privateKey");
    }
    localStorage.setItem("network", network);
    localStorage.setItem("connection", "default");
    await daoManagerInstance.createConnection({
      connectionType: ConnectionType.default,
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      privateKey: privateKey,
      accountID: accountId,
    });
    router.push(UrlDashboard.profile);
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
        <div className="m-5">
          <CustomButton
            text="Log In By Default"
            onClick={onOpen}
            style={{ fontSize: "25px" }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Account ID"
                    placeholder="Enter your account id"
                    variant="bordered"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  />
                  <Input
                    label="Privet key"
                    placeholder="Enter your privet key"
                    type="password"
                    variant="bordered"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      await logInDefault({ network: selectedKey });
                    }}
                  >
                    Sign in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

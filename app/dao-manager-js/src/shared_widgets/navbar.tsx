"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link"; // Или используйте ваш компонент Link
import { Button } from "@nextui-org/react"; // Подставьте вашу библиотеку кнопок
import styles from "../app/style/profile.module.css"; // Стили, если они есть
import DaoManagerJS from "../../../../package/dao_manager_js_lib";
import { Utils } from "../../../../package/utils/utils";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";

const NavbarComponent: React.FC = () => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const router = useRouter();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const [accountId, setAccountId] = useState<string | null>();
  const [balance, setBalance] = useState<string | null>();

  useEffect(() => {
    const fetchBalance = async () => {
      const accountID = localStorage.getItem("my-app_wallet_auth_key")
        ? JSON.parse(localStorage.getItem("my-app_wallet_auth_key")).accountId
        : JSON.parse(dataDefault).accountId;
      setAccountId(accountID);

      try {
        await upadateBalance({ accountId: accountID });
      } catch (error) {
        console.error("Error while get balance:", error);
      }
    };

    fetchBalance();
  }, []);

  async function upadateBalance({ accountId }: { accountId: string }) {
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
    if (localStorage.getItem("my-app_default_auth_key")) {
      localStorage.removeItem("my-app_default_auth_key");
    }
    router.push(UrlDashboard.login);
  }

  return (
    <div className={styles.navBar}>
      <Navbar disableAnimation isBordered>
        <NavbarContent className="md:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="md:hidden pr-3" justify="center">
          <NavbarBrand>
            <Link
              href={UrlDashboard.profile}
              className="font-bold text-inherit color-white"
            >
              DAO-MANAGER
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden md:flex justify-center"
          justify="start"
        >
          <NavbarBrand>
            <Link
              href={UrlDashboard.profile}
              className="font-bold text-inherit"
            >
              DAO-MANAGER
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href={UrlDashboard.create_dao}>
              Create DAO
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href={UrlDashboard.add_propose}
              aria-current="page"
              color="foreground"
            >
              Add Proposal
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href={UrlDashboard.settings_dao}>
              Settings DAO
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarContent
            className="hidden md:flex flex-col justify-center"
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
            <Link color="foreground" href={UrlDashboard.create_dao}>
              Create DAO
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href={UrlDashboard.add_propose}
              aria-current="page"
              color="foreground"
            >
              Add Proposal
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" href={UrlDashboard.settings_dao}>
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
            {balance ? (
              balance?.length > 20 ? (
                `${balance?.slice(0, 20)}...`
              ) : (
                balance
              )
            ) : (
              <Spinner size="sm" />
            )}
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
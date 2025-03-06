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
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import styles from "../app/style/profile.module.css";
import { ServiceDAO } from "../service/service";
import { usePathname, useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { ConstantsDashboard } from "../const/const";
import { DaoManagerJS, Utils } from "dao-manager-js";

const NavbarComponent: React.FC = () => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | null>();
  const pathname = usePathname();

  const navbarItams = [
    {
      title: "Create DAO",
      href: UrlDashboard.create_dao,
    },
    {
      title: "Add Proposal",
      href: UrlDashboard.add_propose,
    },
    {
      title: "Settings DAO",
      href: UrlDashboard.settings_dao,
    },
  ];

  useEffect(() => {
    async function init() {
      const connection = await ServiceDAO.checkAuth(router);
      const accountID = daoManagerJS.getAccountID();
      setAccountId(accountID);
    }
    if (router) {
      const handle = setTimeout(() => {
        init();
      }, 0);

      return () => clearTimeout(handle);
    }
  }, [router]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        await upadateBalance({ accountId: accountId });
      } catch (error) {
        console.error("Error while get balance:", error);
      }
    };
    if (accountId) fetchBalance();
  }, [accountId]);

  async function upadateBalance({ accountId }: { accountId: string }) {
    try {
      const balanceYoctoNear = await daoManagerJS.getBalance({
        accountId: accountId,
      });
      const balanceNear = Utils.yoctoNEARToNear(balanceYoctoNear);
      setBalance(balanceNear);
    } catch (error) {
      console.error("Error while get balance:", error);
    }
  }

  function logOut() {
    daoManagerJS.signOut();
    localStorage.removeItem("network");
    localStorage.removeItem(ConstantsDashboard.daoId);
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

        {/* Top navbar */}
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
          {navbarItams.map((item, index) => {
            return (
              <NavbarItem
                key={index}
                className={
                  pathname == item.href
                    ? styles.link_appBar_button_active
                    : styles.link_appBar_button
                }
              >
                <Link color="foreground" href={item.href}>
                  {item.title}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarContent
            className="hidden md:flex flex-col justify-center"
            justify="end"
          >
            {accountId == null ? (
              <NavbarItem>
                <Spinner color="white" />
              </NavbarItem>
            ) : (
              <>
                <NavbarItem>
                  {`Account ID: ${
                    accountId
                      ? accountId?.length > 20
                        ? `${accountId?.slice(0, 20)}...`
                        : accountId
                      : "Loading..."
                  }`}
                </NavbarItem>
                <NavbarItem>
                  {`Balance: ${
                    balance
                      ? balance.length > 10
                        ? `${balance.slice(0, 10)}... NEAR`
                        : `${balance} NEAR`
                      : "Loading..."
                  }`}
                </NavbarItem>
              </>
            )}
          </NavbarContent>
          <NavbarItem>
            <div className={styles.appBarButtonColor} onClick={logOut}>
              Log Out
            </div>
          </NavbarItem>
        </NavbarContent>

        {/* Left navbar */}
        <NavbarMenu
          className="bg-[#262626]"
          style={{ width: "100%", height: "100%" }}
        >
          <NavbarContent>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                color: "white",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  alignContent: "start",
                }}
              >
                {navbarItams.map((item, index) => {
                  return (
                    <NavbarItem key={index}>
                      <Link
                        color="foreground"
                        href={item.href}
                        className={
                          pathname == item.href
                            ? styles.link_appBar_button_active
                            : styles.link_appBar_button
                        }
                      >
                        {item.title}
                      </Link>
                    </NavbarItem>
                  );
                })}
              </div>
              <div style={{ paddingBottom: "20px" }}>
                {accountId == null ? (
                  <NavbarItem>
                    <Spinner color="white" />
                  </NavbarItem>
                ) : (
                  <>
                    <NavbarMenuItem>
                      {`Account ID: ${
                        accountId
                          ? accountId?.length > 20
                            ? `${accountId?.slice(0, 20)}...`
                            : accountId
                          : "Loading..."
                      }`}
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                      {`Balance: ${
                        balance
                          ? balance.length > 10
                            ? `${balance.slice(0, 10)}... NEAR`
                            : `${balance} NEAR`
                          : "Loading..."
                      }`}
                    </NavbarMenuItem>
                  </>
                )}
              </div>
            </div>
          </NavbarContent>
        </NavbarMenu>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;

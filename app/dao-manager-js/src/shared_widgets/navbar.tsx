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
import Link from "next/link";
import { Button } from "@nextui-org/react";
import styles from "../app/style/profile.module.css";
import { ServiceDAO } from "../service/service";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";
import { Utils } from "../../../../package/utils/utils";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { ConstantsDashboard } from "../const/const";

const NavbarComponent: React.FC = () => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>();
  const [balance, setBalance] = useState<string | null>();

  ServiceDAO.checkAuth(router);

  useEffect(() => {
    const fetchBalance = async () => {
      const accountID = daoManagerJS.getAccountID();
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
            {accountId == null ? (
              <NavbarItem>
                <Spinner />
              </NavbarItem>
            ) : (
              <>
                <NavbarItem>
                  {accountId?.length > 20
                    ? `${accountId?.slice(0, 20)}...`
                    : accountId}
                </NavbarItem>
                <NavbarItem>
                  {balance ? (
                    balance?.length > 10 ? (
                      `${balance?.slice(0, 10)}... NEAR`
                    ) : (
                      balance + " NEAR"
                    )
                  ) : (
                    <Spinner size="sm" />
                  )}
                </NavbarItem>
              </>
            )}
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
          {accountId == null ? (
            <NavbarItem>
              <Spinner />
            </NavbarItem>
          ) : (
            <>
              <NavbarMenuItem>
                Account ID:
                {accountId?.length > 20
                  ? `${accountId?.slice(0, 20)}...`
                  : accountId}
              </NavbarMenuItem>
              <NavbarMenuItem>
                Balance:
                {balance ? (
                  balance?.length > 10 ? (
                    `${balance?.slice(0, 10)}... NEAR`
                  ) : (
                    balance + " NEAR"
                  )
                ) : (
                  <Spinner size="sm" />
                )}
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;

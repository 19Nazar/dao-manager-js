"use client";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";
import { useState, useEffect, use } from "react";
import { NetworkID } from "../../../../package/models/near_models";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { Spinner } from "@nextui-org/react";
import { color } from "framer-motion";
// import DaoManagerJS from "DaoManagerJS";

export default function Home() {
  const walletInstance = DaoManagerJS.getInstance();
  const router = useRouter();

  useEffect(() => {
    const typeConnection = localStorage.getItem("connection");
    if (!typeConnection) {
      router.push(UrlDashboard.login);
    } else {
      router.push(UrlDashboard.profile);
    }
  }, [router]); // Убираем `nearWallet` из зависимостей, чтобы избежать бесконечного рендера

  return (
    <div className="centered-container">
      <Spinner
        label="Loading..."
        color="warning"
        style={{ color: "#a463b0" }}
      />
    </div>
  );
}

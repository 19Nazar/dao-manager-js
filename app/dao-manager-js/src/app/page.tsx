"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { Spinner } from "@nextui-org/react";
// import DaoManagerJS from "DaoManagerJS";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const my_app_wallet = localStorage.getItem("my-app_wallet_auth_key");
    const dataDefault = localStorage.getItem("my-app_default_auth_key");

    if (my_app_wallet || dataDefault) {
      router.push(UrlDashboard.profile);
    } else {
      router.push(UrlDashboard.login);
    }
  }, [router]);

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

"use client";
import { useSearchParams } from "next/navigation";
import { DaoManagerJS } from "dao-manager-js";
import { useEffect } from "react";

export function useTransactionStatus(
  setResSuccessData: (data: string | null) => void,
  setResFailureData: (data: string | null) => void,
  connection: boolean,
) {
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();

  useEffect(() => {
    async function getHesh({ txnHesh, accountId }) {
      const resp = await daoManagerJS.getResultTxns({
        txnHesh,
        accountId,
      });
      const decoded = atob(resp.data.toString());
      setResSuccessData(decoded.trim() === "" ? "Success operation" : decoded);
    }
    if (connection) {
      const accountID = daoManagerJS.getAccountID();
      const hesh = searchParams.get("transactionHashes");
      const errorMessage = searchParams.get("errorMessage");

      if (hesh) {
        getHesh({ txnHesh: hesh, accountId: accountID });
      } else if (errorMessage) {
        setResFailureData(decodeURIComponent(errorMessage));
      }

      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        currentUrl.search = "";
        window.history.replaceState(null, "", currentUrl);
      }
    }
  }, [searchParams, setResSuccessData, setResFailureData, connection]);
}

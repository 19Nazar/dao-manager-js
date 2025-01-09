import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";

const useTransactionStatus = (
  setResSuccessData: (data: string | null) => void,
  setResFailureData: (data: string | null) => void,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  const daoManagerJS = DaoManagerJS.getInstance();

  async function getHesh({ txnHesh, accountId }) {
    const resp = await daoManagerJS.getResultTxns({
      txnHesh: txnHesh,
      accountId: accountId,
    });
    console.log(resp);
    const decoded = atob(resp.data.toString());
    setResSuccessData(decoded);
  }
  const accountID = daoManagerJS.getAccountID();
  const hesh = searchParams.get("transactionHashes");
  const errorMessage = searchParams.get("errorMessage");
  if (hesh) {
    getHesh({ txnHesh: hesh, accountId: accountID });
  } else if (errorMessage) {
    const decodedErrorMessage = errorMessage
      ? decodeURIComponent(errorMessage)
      : null;
    setResFailureData(decodedErrorMessage);
  }
  const currentUrl = new URL(window.location.href);
  currentUrl.search = "";
  window.history.replaceState(null, "", currentUrl);
};

export default useTransactionStatus;

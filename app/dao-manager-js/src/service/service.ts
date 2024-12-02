import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import {
  ConnectionType,
  NetworkID,
} from "../../../../package/models/near_models";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";

class Service {
  async checkAuth(router: ReturnType<typeof useRouter>) {
    const network = localStorage.getItem("network");

    if (!network) {
      router.push(UrlDashboard.login);
    } else if (network) {
      await DaoManagerJS.getInstance().createConnection({
        connectionType: ConnectionType.wallet,
        networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      });
    } else {
      throw new Error("You need log in correctly");
    }
  }
}

export const ServiceDAO = new Service();

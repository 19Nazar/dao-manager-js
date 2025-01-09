import { useRouter } from "next/navigation";
import { UrlDashboard } from "../url_dashboard/url_dashboard";
import { useEffect } from "react";
import {
  ConnectionType,
  NetworkID,
} from "../../../../package/models/near_models";
import DaoManagerJS from "../../../../package/dao_manager_js_lib";

class Service {
  async checkAuth(router: ReturnType<typeof useRouter>): Promise<boolean> {
    try {
      const network = localStorage.getItem("network");

      if (!network) {
        router.push(UrlDashboard.login);
      } else if (network) {
        const res = await DaoManagerJS.getInstance().createConnection({
          connectionType: ConnectionType.wallet,
          networkID:
            network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
        });
        return res;
      } else {
        throw new Error("You need log in correctly");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const ServiceDAO = new Service();

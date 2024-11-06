import { keyStores } from "near-api-js";
class NearWallet {
  private static instance: NearWallet | null = null;
  //    ConnectConfig connectionConfig;

  static getInstance(): NearWallet {
    if (!NearWallet.instance) {
      NearWallet.instance = new NearWallet();
    }
    return NearWallet.instance;
  }
}

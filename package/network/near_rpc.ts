import { ConnectConfig, connect, WalletConnection } from "near-api-js";
import { NetworkID } from "../models/near_models";
import { NearConstants } from "../constants/near_constants";
export default class NearWallet {
  private static instance: NearWallet | null = null;
  config: Map<NetworkID, ConnectConfig> | null = null;
  walletConnection: WalletConnection | null = null;

  private constructor() {
    this.config = new Map<NetworkID, ConnectConfig>();
    this.config.set(NetworkID.mainnet, NearConstants.mainConnectionConfig);
    this.config.set(NetworkID.testnet, NearConstants.testConnectionConfig);
  }

  static getInstance(): NearWallet {
    if (!NearWallet.instance) {
      NearWallet.instance = new NearWallet();
    }
    return NearWallet.instance;
  }

  async createWalletConnection(networkID: NetworkID) {
    // connect to NEAR
    if (!this.config) {
      throw new Error("Configuration is not available.");
    }

    const conf = this.config.get(networkID);

    if (!conf) {
      throw new Error("NetworkID is not defined");
    }

    const nearConnection = await connect(conf);

    // create wallet connection
    this.walletConnection = new WalletConnection(nearConnection, "my-app");
  }
}

import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
} from "near-api-js";
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

  async createWalletConnection({ networkID }: { networkID: NetworkID }) {
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
    if (!this.walletConnection.isSignedIn()) {
      await this.walletConnection.requestSignIn({ keyType: "ed25519" });
    } else {
      console.log(
        "Пользователь уже авторизован:",
        this.walletConnection.getAccountId(),
      );
    }

    console.log(this.walletConnection);
  }

  async checkIsSign(): Promise<boolean> {
    if (!this.walletConnection.isSignedIn()) {
      console.log({ false: false, data: !this.walletConnection });
      return false;
    } else {
      console.log({ false: true, data: !this.walletConnection });
      console.log(this.walletConnection.getAccountId());
      console.log(this.walletConnection.account());
      return true;
    }
  }

  async callSmartContractFunc(
    methodName,
    args = {},
    gas = "300000000000000",
    deposit = "1000000000000000000000000",
  ) {
    const contract = new Contract(
      this.walletConnection.account(),
      "example-contract.testnet",
      {
        viewMethods: [],
        changeMethods: [methodName], // укажите любые методы, если они известны, или оставьте пустым
      },
    );

    if (contract[methodName]) {
      try {
        const result = await contract[methodName](args, gas, deposit);
        console.log("Результат вызова:", result);
      } catch (error) {
        console.error("Ошибка при вызове метода:", error);
      }
    } else {
      console.error("Метод не существует в контракте:", methodName);
    }
  }
}

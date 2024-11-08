import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
  Near,
} from "near-api-js";
import { NetworkID } from "../models/near_models";
import { NearConstants } from "../constants/near_constants";
export default class NearWallet {
  private static instance: NearWallet | null = null;
  config: Map<NetworkID, ConnectConfig> | null = null;
  walletConnection: WalletConnection | null = null;
  nearConnection: Near | null = null;

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

    this.nearConnection = await connect(conf);

    // create wallet connection
    this.walletConnection = new WalletConnection(this.nearConnection, "my-app");
    if (!this.walletConnection.isSignedIn()) {
      await this.walletConnection.requestSignIn({ keyType: "ed25519" });
    } else {
      console.log(
        "Пользователь уже авторизован:",
        this.walletConnection.getAccountId(),
      );
    }
  }

  async checkIsSign(): Promise<boolean> {
    if (this.walletConnection == null) {
      throw new Error("Wallet connection is absent");
    }
    try {
      if (!this.walletConnection.isSignedIn()) {
        console.log({ false: false, data: !this.walletConnection });
        return false;
      } else {
        console.log({ false: true, data: !this.walletConnection });
        console.log(this.walletConnection.getAccountId());
        console.log(this.walletConnection.account());
        return true;
      }
    } catch (error) {
      console.error("Check is unable", error);
      throw new Error("Check is unable", error);
    }
  }

  async callSmartContractFunc({
    contractId,
    methodName,
    args = {},
    gas = "300000000000000",
    deposit = "1000000000000000000000000",
  }: {
    contractId: string;
    methodName: string;
    args?: object;
    gas?: string;
    deposit?: string;
  }) {
    if (this.walletConnection == null) {
      throw new Error("Wallet connection is absent");
    }
    try {
      const contract = new Contract(
        this.walletConnection.account(),
        contractId,
        {
          viewMethods: [],
          changeMethods: [methodName],
          useLocalViewExecution: false, // укажите любые методы, если они известны, или оставьте пустым
        },
      );

      if (contract[methodName]) {
        try {
          const result = await contract[methodName](args, gas, deposit);
          console.log("Результат вызова:", result);
          return { status: 200, data: result };
        } catch (error) {
          console.error("Ошибка при вызове метода:", error);
        }
      } else {
        console.error("Метод не существует в контракте:", methodName);
      }
    } catch (error) {
      console.error("Error call smart contract", error);
      throw new Error("Error call smart contract", error);
    }
  }

  async newCallSmartContractFunc({
    contractId,
    methodName,
    args = {},
    gas = "300000000000000",
    deposit = "1000000000000000000000000",
  }: {
    contractId: string;
    methodName: string;
    args?: object;
    gas?: string;
    deposit?: string;
  }) {
    if (this.walletConnection == null) {
      throw new Error("Wallet connection is absent");
    }

    try {
      const currentUrl: string = window.location.href;
      const res = this.walletConnection.account().functionCall({
        contractId: contractId,
        methodName: methodName,
        args: args,
        gas: BigInt(gas),
        attachedDeposit: BigInt(deposit),
        walletCallbackUrl: currentUrl,
      });

      console.log(res);
    } catch (error) {
      console.error("Error call smart contract", error);
      throw new Error("Error call smart contract", error);
    }
  }

  async getTxnsHeshStatus({
    txnHesh,
    accountId,
  }: {
    txnHesh: string;
    accountId: string;
  }) {
    try {
      const res = this.nearConnection.connection.provider.txStatusReceipts(
        txnHesh,
        accountId,
      );
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
}

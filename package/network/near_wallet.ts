import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
  Near,
} from "near-api-js";
import { BlockChainResponse, NetworkID } from "../models/near_models";
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
    changeMethodName,
    viewMethodName,
    args = {},
    gas = "300000000000000",
    deposit = "1000000000000000000000000",
  }: {
    contractId: string;
    changeMethodName?: string;
    viewMethodName?: string;
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
          viewMethods: [viewMethodName],
          changeMethods: [changeMethodName],
          useLocalViewExecution: false, // укажите любые методы, если они известны, или оставьте пустым
        },
      );

      if (contract[changeMethodName ?? viewMethodName]) {
        try {
          const result = await contract[changeMethodName ?? viewMethodName](
            args,
            gas,
            deposit,
          );
          console.log("Результат вызова:", result);
          return { status: 200, data: result };
        } catch (error) {
          console.error("Ошибка при вызове метода:", error);
        }
      } else {
        console.error(
          "Метод не существует в контракте:",
          changeMethodName ?? viewMethodName,
        );
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
    accountId = this.walletConnection?.getAccountId(),
  }: {
    txnHesh: string;
    accountId?: string;
  }): Promise<BlockChainResponse> {
    if (!this.nearConnection) {
      throw new Error("You need connect to wallet");
    }
    if (accountId == null) {
      throw new Error("You need input account id or connect to wallet");
    }
    try {
      const res =
        await this.nearConnection.connection.provider.txStatusReceipts(
          txnHesh,
          accountId,
          "FINAL",
        );
      const respStatus = res.status as any;
      if ("Failure" in respStatus) {
        return new BlockChainResponse({
          status: "error",
          data: respStatus.Failure,
        });
      } else if ("SuccessValue" in respStatus) {
        return new BlockChainResponse({
          status: "success",
          data: respStatus.SuccessValue,
        });
      } else {
        throw new Error("Unknown action");
      }
    } catch (e) {
      console.error(e);
      throw new Error("Get transaction error:", e);
    }
  }

  signOut() {
    this.walletConnection?.signOut();
  }
}

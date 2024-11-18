import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
  Near,
  KeyPair,
  keyStores,
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

  async test() {
    const keyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY = "ed25519:5oSj8pDE7F2vRQtsfnf3ramjDu8wWt4C3msVn1apL22J"; // Приватный ключ, соответствующий публичному ключу
    const ACCOUNT_ID = "maierr.testnet";
    const NETWORK_ID = "testnet";

    // Добавляем ключ в keyStore
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey(NETWORK_ID, ACCOUNT_ID, keyPair);

    // Подключаемся к NEAR
    const near = await connect({
      networkId: NETWORK_ID,
      keyStore, // Передаём keyStore с ключом
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
    });

    const account = await near.account(ACCOUNT_ID);

    // Вызываем смарт-контракт
    const result = await account.functionCall({
      contractId: "sputnik-v2.testnet",
      methodName: "create",
      args: { arg1: "value1" }, // Параметры функции
      gas: BigInt("100000000000000"), // Лимит газа
      attachedDeposit: BigInt("1000000000000000000000000"), // (опционально) Депозит
    });
    console.log(result);
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

    this.walletConnection = new WalletConnection(this.nearConnection, "my-app");
  }

  async sigIn({
    successUrl,
    failureUrl,
  }: {
    successUrl?: string;
    failureUrl?: string;
  }) {
    if (!this.walletConnection.isSignedIn()) {
      await this.walletConnection.requestSignIn({
        keyType: "ed25519",
        successUrl: successUrl,
        failureUrl: failureUrl,
      });
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

  async newCallSmartContractFunc({
    contractId,
    methodName,
    args = {},
    gas = "300000000000000",
    deposit = "0",
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
      // const currentUrl: string = window.location.href;
      const res = this.walletConnection.account().functionCall({
        contractId: contractId,
        methodName: methodName,
        args: args,
        gas: BigInt(gas),
        attachedDeposit: BigInt(deposit),
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

  async signOut() {
    await this.walletConnection?.signOut();
  }
}

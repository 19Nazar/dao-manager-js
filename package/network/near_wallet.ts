import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
  Near,
  KeyPair,
  keyStores,
} from "near-api-js";
import {
  BlockChainResponse,
  ConnectionType,
  NetworkID,
} from "../models/near_models";
import { NearConstants } from "../constants/near_constants";
import { KeyPairString } from "near-api-js/lib/utils";
import { promises } from "dns";
import { error } from "console";
export default class NearWallet {
  private static instance: NearWallet | null = null;
  config: Map<ConnectionType, Map<NetworkID, ConnectConfig>> | null = null;
  walletConnection: WalletConnection | null = null;
  nearConnection: Near | null = null;

  private constructor() {
    var walletConnection = new Map<NetworkID, ConnectConfig>();
    walletConnection.set(
      NetworkID.mainnet,
      NearConstants.walletMainConnectionConfig,
    );
    walletConnection.set(
      NetworkID.testnet,
      NearConstants.walletTestConnectionConfig,
    );
    var defaultConnection = new Map<NetworkID, ConnectConfig>();
    defaultConnection.set(
      NetworkID.mainnet,
      NearConstants.defaultMainConnectionConfig,
    );
    defaultConnection.set(
      NetworkID.testnet,
      NearConstants.defaultTestConnectionConfig,
    );
    this.config = new Map<ConnectionType, Map<NetworkID, ConnectConfig>>();
    this.config.set(ConnectionType.wallet, walletConnection);
    this.config.set(ConnectionType.default, defaultConnection);
  }

  static getInstance(): NearWallet {
    if (!NearWallet.instance) {
      NearWallet.instance = new NearWallet();
    }
    return NearWallet.instance;
  }

  async createConnection({
    connectionType,
    networkID,
    privateKey,
    accountID,
  }: {
    privateKey?: string;
    accountID?: string;
    connectionType: ConnectionType;
    networkID: NetworkID;
  }) {
    if (!this.config) {
      throw new Error("Configuration is not available.");
    }
    const typeConfig = this.config.get(connectionType);
    if (!typeConfig) {
      throw new Error("Undefaind connectionType");
    }
    const config = typeConfig.get(networkID);
    if (!config) {
      throw new Error("Undefaind networkID");
    }
    if (connectionType == ConnectionType.wallet) {
      await this.createWalletConnection({ config: config });
    } else if (connectionType == ConnectionType.default) {
      if (!privateKey || !accountID) {
        throw new Error(
          "For default connection you need input privateKey and accountID",
        );
      }
      await this.createDefaultConnection({
        config: config,
        networkID: networkID,
        privateKey: privateKey,
        accountID: accountID,
      });
    } else {
      throw new Error("Unexpected action");
    }
  }

  async createDefaultConnection({
    privateKey,
    accountID,
    networkID,
    config,
  }: {
    config: ConnectConfig;
    privateKey: string;
    accountID: string;
    networkID: NetworkID;
  }) {
    if (
      !privateKey.startsWith("ed25519:") &&
      !privateKey.startsWith("secp256k1:")
    ) {
      throw new Error("Private key must start with ed25519 or secp256k1");
    }

    try {
      const keyStore = new keyStores.InMemoryKeyStore();

      const keyPair = KeyPair.fromString(privateKey as KeyPairString);

      await keyStore.setKey(networkID.toString(), accountID, keyPair);

      console.log(keyStore);

      const finalConfig = { ...config, keyStore: keyStore };

      this.nearConnection = await connect(finalConfig);
    } catch (error) {
      throw new Error("Error create connection:", error);
    }
  }

  async callSmartContract({
    accountID,
    contractId,
    methodName,
    args = {},
    gas = "300000000000000",
    deposit = "0",
  }: {
    accountID: string;
    contractId: string;
    methodName: string;
    args?: object;
    gas?: string;
    deposit?: string;
  }): Promise<void> {
    if (!this.nearConnection) {
      throw new Error("Absent near connection");
    }
    try {
      const account = await this.nearConnection.account(accountID);

      const result = await account.functionCall({
        contractId: contractId,
        methodName: methodName,
        args: args,
        gas: BigInt(gas),
        attachedDeposit: BigInt(deposit),
      });
      console.log(result);
    } catch (error) {
      throw new Error("Error make smart contract call", error);
    }
  }

  async createWalletConnection({ config }: { config: ConnectConfig }) {
    this.nearConnection = await connect(config);

    this.walletConnection = new WalletConnection(this.nearConnection, "my-app");
  }

  async sigIn({
    successUrl,
    failureUrl,
  }: {
    successUrl?: string;
    failureUrl?: string;
  }) {
    if (this.walletConnection == null) {
      throw new Error("You must connect to NEAR");
    }
    if (!this.walletConnection.isSignedIn()) {
      await this.walletConnection.requestSignIn({
        keyType: "ed25519",
        successUrl: successUrl,
        failureUrl: failureUrl,
      });
    } else {
      console.log(
        "The user is already authorized:",
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
    if (this.walletConnection) {
      await this.walletConnection?.signOut();
    }
  }
}

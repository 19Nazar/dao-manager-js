import {
  ConnectConfig,
  connect,
  WalletConnection,
  Contract,
  Near,
  KeyPair,
  keyStores,
  transactions,
} from "near-api-js";
import {
  BlockChainResponse,
  ConnectionType,
  NetworkID,
  Status,
} from "../models/near_models";
import { NearConstants } from "../constants/near_constants";
import { KeyPairString } from "near-api-js/lib/utils";
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
      throw new Error("Undefined networkID");
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
      throw new Error(`Error create connection: ${error.message}`);
    }
  }

  async callSmartContract({
    contractId,
    changeMethodName,
    args,
    deposit = "0",
    gas = "30000000000000",
  }: {
    contractId: string;
    changeMethodName: string;
    args: any;
    deposit?: string;
    gas?: string;
  }) {
    const accountId = this.getAccountID();
    if (!accountId) {
      throw new Error("Wallet connection is absent");
    }

    const account = await this.nearConnection!.account(accountId);
    const functionCall = transactions.functionCall(
      changeMethodName,
      args,
      BigInt(gas),
      BigInt(deposit),
    );

    const result = await account.signAndSendTransaction({
      receiverId: contractId,
      actions: [functionCall],
    });

    return result;
  }

  async createWalletConnection({ config }: { config: ConnectConfig }) {
    this.nearConnection = await connect(config);

    this.walletConnection = new WalletConnection(this.nearConnection, "my-app");
  }

  async logIn({
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
      console.error(`Check is unable: ${error.message}`);
      throw new Error(`Check is unable: ${error.message}`);
    }
  }

  getAccountID(): string {
    if (this.walletConnection == null) {
      throw new Error("Wallet connection is absent");
    }
    return this.walletConnection.getAccountId();
  }

  checkTest() {
    const keyStore = new keyStores.InMemoryKeyStore();
    console.log(keyStore);
  }

  async createAccessKey({
    nameContract,
    successUrl,
  }: {
    nameContract: string;
    successUrl?: string;
  }) {
    try {
      if (this.walletConnection == null) {
        throw new Error("Wallet connection is absent");
      }
      // const keyPair = KeyPair.fromRandom("ed25519");

      // const publicKey = keyPair.getPublicKey().toString();

      // await this.walletConnection.account().addKey(publicKey, nameContract);

      // console.log("Access Key create: ", publicKey);

      // return { keyPair, publicKey };
      await this.walletConnection.requestSignIn({
        keyType: "ed25519",
        contractId: nameContract,
        successUrl: successUrl,
      });
    } catch (error) {
      throw new Error(`Error while create access key: ${error.message}`);
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
      const account = this.walletConnection.account();
      const res = await account.functionCall({
        contractId: contractId,
        methodName: methodName,
        args: args,
        gas: BigInt(gas),
        attachedDeposit: BigInt(deposit),
      });

      console.log(res);
    } catch (error) {
      console.error(`Error call smart contract: ${error.message}`);
      throw new Error(`Error call smart contract: ${error.message}`);
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
          status: Status.error,
          data: respStatus.Failure,
        });
      } else if ("SuccessValue" in respStatus) {
        return new BlockChainResponse({
          status: Status.successful,
          data: respStatus.SuccessValue,
        });
      } else {
        throw new Error("Unknown action");
      }
    } catch (e) {
      console.error(e);
      throw new Error(`Get transaction error: ${e.message}`);
    }
  }

  async signOut() {
    if (this.walletConnection) {
      await this.walletConnection?.signOut();
    }
  }

  async callSmartContractFunc({
    contractId,
    changeMethodName,
    viewMethodName,
    args = {},
    gas = "300000000000000",
    deposit = "0",
  }: {
    contractId: string;
    changeMethodName?: string;
    viewMethodName?: string;
    args?: object;
    gas?: string;
    deposit?: string;
  }): Promise<BlockChainResponse> {
    if (this.walletConnection == null) {
      throw new Error("Wallet connection is absent");
    }
    if (!changeMethodName && !viewMethodName) {
      throw new Error("At least one method must be specified");
    }
    try {
      const contract = new Contract(
        this.walletConnection.account(),
        contractId,
        {
          viewMethods: viewMethodName ? [viewMethodName] : [],
          changeMethods: changeMethodName ? [changeMethodName] : [],
          useLocalViewExecution: false,
        },
      );
      if (viewMethodName && contract[viewMethodName]) {
        try {
          const result = await contract[viewMethodName](args);
          return new BlockChainResponse({
            status: Status.successful,
            data: result,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error call smart contract: ${error.message}`);
          } else {
            throw new Error(`Error call smart contract: ${String(error)}`);
          }
        }
      } else if (changeMethodName && contract[changeMethodName]) {
        try {
          const result = await contract[changeMethodName]({
            args: args,
            gas: gas,
            amount: deposit,
          });
          return new BlockChainResponse({
            status: Status.successful,
            data: result,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error call smart contract: ${error.message}`);
          } else {
            throw new Error(`Error call smart contract: ${String(error)}`);
          }
        }
      } else {
        throw new Error(
          `Methods not exist: ${changeMethodName ?? viewMethodName}`,
        );
      }
    } catch (error) {
      console.error(`Error call smart contract: ${error.message}`);
      throw new Error(`Error call smart contract ${error.message}`);
    }
  }
}

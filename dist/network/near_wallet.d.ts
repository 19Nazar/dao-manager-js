import { ConnectConfig, WalletConnection, Near } from "near-api-js";
import { BlockChainResponse, ConnectionType, NetworkID } from "../models/near_models";
export default class NearWallet {
    private static instance;
    config: Map<ConnectionType, Map<NetworkID, ConnectConfig>> | null;
    walletConnection: WalletConnection | null;
    nearConnection: Near | null;
    private constructor();
    static getInstance(): NearWallet;
    createConnection({ connectionType, networkID, privateKey, accountID, }: {
        privateKey?: string;
        accountID?: string;
        connectionType: ConnectionType;
        networkID: NetworkID;
    }): Promise<void>;
    createDefaultConnection({ privateKey, accountID, networkID, config, }: {
        config: ConnectConfig;
        privateKey: string;
        accountID: string;
        networkID: NetworkID;
    }): Promise<void>;
    callSmartContract({ contractId, changeMethodName, args, deposit, gas, }: {
        contractId: string;
        changeMethodName: string;
        args: any;
        deposit?: string;
        gas?: string;
    }): Promise<import("@near-js/types").FinalExecutionOutcome>;
    createWalletConnection({ config }: {
        config: ConnectConfig;
    }): Promise<void>;
    logIn({ successUrl, failureUrl, }: {
        successUrl?: string;
        failureUrl?: string;
    }): Promise<void>;
    checkIsSign(): Promise<boolean>;
    getAccountID(): string;
    checkTest(): void;
    createAccessKey({ nameContract, successUrl, }: {
        nameContract: string;
        successUrl?: string;
    }): Promise<void>;
    newCallSmartContractFunc({ contractId, methodName, args, gas, deposit, }: {
        contractId: string;
        methodName: string;
        args?: object;
        gas?: string;
        deposit?: string;
    }): Promise<void>;
    getTxnsHeshStatus({ txnHesh, accountId, }: {
        txnHesh: string;
        accountId?: string;
    }): Promise<BlockChainResponse>;
    signOut(): Promise<void>;
    callSmartContractFunc({ contractId, changeMethodName, viewMethodName, args, gas, deposit, }: {
        contractId: string;
        changeMethodName?: string;
        viewMethodName?: string;
        args?: object;
        gas?: string;
        deposit?: string;
    }): Promise<BlockChainResponse>;
}

import { keyStores } from "near-api-js";
export declare class NearConstants {
    static walletMainConnectionConfig: {
        networkId: string;
        keyStore: keyStores.InMemoryKeyStore;
        nodeUrl: string;
        walletUrl: string;
        helperUrl: string;
        explorerUrl: string;
    };
    static walletTestConnectionConfig: {
        networkId: string;
        keyStore: keyStores.InMemoryKeyStore;
        nodeUrl: string;
        walletUrl: string;
        helperUrl: string;
        explorerUrl: string;
    };
    static defaultMainConnectionConfig: {
        networkId: string;
        nodeUrl: string;
        walletUrl: string;
        helperUrl: string;
    };
    static defaultTestConnectionConfig: {
        networkId: string;
        nodeUrl: string;
        walletUrl: string;
        helperUrl: string;
    };
    static contractPerNetwork: {
        testnet: string;
    };
    static NetworkId: string;
}

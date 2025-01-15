"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearConstants = void 0;
const near_api_js_1 = require("near-api-js");
class NearConstants {
}
exports.NearConstants = NearConstants;
NearConstants.walletMainConnectionConfig = {
    networkId: "mainnet",
    keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://nearblocks.io",
};
NearConstants.walletTestConnectionConfig = {
    networkId: "testnet",
    keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
};
NearConstants.defaultMainConnectionConfig = {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
};
NearConstants.defaultTestConnectionConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
};
NearConstants.contractPerNetwork = {
    testnet: "guestbook.near-examples.testnet",
};
NearConstants.NetworkId = "testnet";
//# sourceMappingURL=near_constants.js.map
**[DAO-Manager-JS Application](https://github.com/19Nazar/dao-manager-js/tree/pre_relise/app)**

# About **DAO-Manager-JS**

**DAO-Manager-JS** is a library designed for easy interaction with DAOs on the NEAR blockchain. It provides the ability to interact with DAOs without delving into the details. The foundation of the library is **[Sputnik DAO](https://github.com/near-daos/sputnik-dao-contract)**.

## Interaction with the **Library**

To start using the library, you need to install all dependencies. For example:

```bash
yarn install
```

After installing all dependencies, the library must be compiled. For example:

```bash
yarn run build
```

In your application, include it as follows in the package.json file:

```json
"dao-manager-js-lib": "file:../dist",
```

Now, you can proceed with coding:

```javascript
const daoManagerInstance = DaoManagerJS.getInstance();

async function logInWallet({ network }: { network: string }) {
await daoManagerInstance.createConnection({
networkID: network === "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
connectionType: ConnectionType.wallet,
});
localStorage.setItem("network", network);
const isLogIn = await daoManagerInstance.checkIsSign();
await daoManagerInstance.logIn({
successUrl: UrlDashboard.url + UrlDashboard.profile,
failureUrl: UrlDashboard.url + UrlDashboard.login,
});
const test = await daoManagerJS.createDaoManager({
name: name.toLocaleLowerCase(),
purpose: purpose,
metadata: JSON.stringify({ iconImage: iconImage }),
policy: convertPolicy,
});
}

```

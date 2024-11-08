import NearWallet from "../network/near_wallet";

export default class DaoService {
  private static instance: DaoService | null = null;
  nearWallet: NearWallet;

  constructor({ nearWallet }: { nearWallet: NearWallet }) {
    this.nearWallet = nearWallet;
  }

  static getInstance(): DaoService {
    if (!DaoService.instance) {
      DaoService.instance = new DaoService({
        nearWallet: NearWallet.getInstance(),
      });
    }
    return DaoService.instance;
  }

  async createDaoMeneger({
    name = "",
    purpose = "",
    metadata = "",
    policy = [],
  }: {
    name: string;
    purpose: string;
    metadata?: string;
    policy?: Array<string>;
  }) {
    const args = JSON.stringify({
      config: { name: name, purpose: purpose, metadata: metadata },
      policy: policy,
    });
    const encodedArgs = Buffer.from(args).toString("base64");
    const res = this.nearWallet.newCallSmartContractFunc({
      contractId: "sputnik-v2.testnet",
      methodName: "create",
      args: {
        name: name,
        args: encodedArgs,
      },
      deposit: "1000000000000000000000000",
    });
    console.log(res);
  }
}

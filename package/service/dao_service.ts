import { AddMemberToRole, ProposalTypes } from "../models/near_models";
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

  async getPolicy({ contractId }: { contractId: string }) {
    const resp = await this.nearWallet.newCallSmartContractFunc({
      contractId: contractId,
      methodName: "get_policy",
      deposit: "0",
    });
    console.log(resp);
  }

  async addProposal({
    contractId,
    description,
    proposalTypes,
    addMemberToRole,
  }: {
    contractId: string;
    description: string;
    proposalTypes: ProposalTypes;
    addMemberToRole?: AddMemberToRole;
  }) {
    let kind;

    switch (proposalTypes) {
      case ProposalTypes.AddMemberToRole: {
        if (addMemberToRole == null) {
          throw new Error("You need add addMemberToRole");
        }
        kind = {
          AddMemberToRole: {
            member_id: addMemberToRole.member_id,
            role: addMemberToRole.role,
          },
        };
      }
      default:
        throw new Error("Not supported proposal type");
    }

    const resp = this.nearWallet.newCallSmartContractFunc({
      contractId: contractId,
      methodName: "add_proposal",
      args: { proposal: { description: description, kind: kind } },
    });
  }
}

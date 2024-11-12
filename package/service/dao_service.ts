import {
  AddBountyModel,
  AddMemberToRoleModel,
  AddProposalModel,
  BountyDoneModel,
  ChangeConfigModel,
  ChangePolicyAddOrUpdateRoleModel,
  ChangePolicyModel,
  ChangePolicyRemoveRoleModel,
  ChangePolicyUpdateDefaultVotePolicyModel,
  ChangePolicyUpdateParametersModel,
  FactoryInfoUpdateModel,
  FunctionCallModel,
  ProposalTypes,
  RemoveMemberFromRoleModel,
  SetStakingContractModel,
  TransferModel,
  UpgradeRemoteModel,
  UpgradeSelfModel,
} from "../models/near_models";
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
    gas,
    deposit,
    proposalTypes,
    addProposalModel,
  }: {
    contractId: string;
    description: string;
    gas?: string;
    deposit?: string;
    proposalTypes: ProposalTypes;
    addProposalModel: AddProposalModel;
  }) {
    let kind;

    switch (proposalTypes) {
      case ProposalTypes.AddMemberToRole: {
        if (!(addProposalModel instanceof AddMemberToRoleModel)) {
          throw new Error("You need add AddMemberToRoleModel");
        }
        const addMemberToRole = addProposalModel as AddMemberToRoleModel;
        kind = {
          AddMemberToRole: {
            member_id: addMemberToRole.member_id,
            role: addMemberToRole.role,
          },
        };
        break;
      }
      case ProposalTypes.RemoveMemberFromRole: {
        if (!(addProposalModel instanceof RemoveMemberFromRoleModel)) {
          throw new Error("You need add RemoveMemberFromRoleModel");
        }
        const removeMemberFromRoleModel =
          addProposalModel as RemoveMemberFromRoleModel;
        kind = {
          RemoveMemberFromRole: {
            member_id: removeMemberFromRoleModel.member_id,
            role: removeMemberFromRoleModel.role,
          },
        };
      }
      case ProposalTypes.ChangeConfig: {
        if (!(addProposalModel instanceof ChangeConfigModel)) {
          throw new Error("You need add ChangeConfigModel");
        }
        const changeConfigModel = addProposalModel as ChangeConfigModel;
        kind = {
          ChangeConfig: {
            name: changeConfigModel.name,
            purpose: changeConfigModel.purpose,
            metadata: changeConfigModel.metadata,
          },
        };
        break;
      }
      case ProposalTypes.ChangePolicy: {
        if (!(addProposalModel instanceof ChangePolicyModel)) {
          throw new Error("You need add ChangePolicyModel");
        }
        const changePolicyModel = addProposalModel as ChangePolicyModel;
        kind = {
          ChangePolicy: {
            roles: changePolicyModel.roles,
            default_vote_policy: changePolicyModel.default_vote_policy,
            proposal_bond: changePolicyModel.proposal_bond,
            proposal_period: changePolicyModel.proposal_period,
            bounty_bond: changePolicyModel.bounty_bond,
            bounty_forgiveness_period:
              changePolicyModel.bounty_forgiveness_period,
          },
        };
        break;
      }
      case ProposalTypes.FunctionCall: {
        if (!(addProposalModel instanceof FunctionCallModel)) {
          throw new Error("You need add FunctionCallModel");
        }
        const functionCallModel = addProposalModel as FunctionCallModel;
        kind = {
          FunctionCall: {
            receiver_id: functionCallModel.receiver_id,
            actions: functionCallModel.actions,
            deposit: BigInt(functionCallModel.deposit),
            gas: BigInt(functionCallModel.gas),
          },
        };
        break;
      }
      case ProposalTypes.UpgradeSelf: {
        if (!(addProposalModel instanceof UpgradeSelfModel)) {
          throw new Error("You need add UpgradeSelfModel");
        }
        const upgradeSelfModel = addProposalModel as UpgradeSelfModel;
        kind = {
          UpgradeSelf: {
            hash: upgradeSelfModel.hash,
          },
        };
        break;
      }
      case ProposalTypes.UpgradeRemote: {
        if (!(addProposalModel instanceof UpgradeRemoteModel)) {
          throw new Error("You need add UpgradeRemoteModel");
        }
        const upgradeRemoteModel = addProposalModel as UpgradeRemoteModel;
        kind = {
          UpgradeRemote: {
            receiver_id: upgradeRemoteModel.receiver_id,
            method_name: upgradeRemoteModel.method_name,
            hash: upgradeRemoteModel.hash,
          },
        };
        break;
      }
      case ProposalTypes.Transfer: {
        if (!(addProposalModel instanceof TransferModel)) {
          throw new Error("You need add TransferModel");
        }
        const transferModel = addProposalModel as TransferModel;
        kind = {
          Transfer: {
            token_id: transferModel.token_id,
            receiver_id: transferModel.receiver_id,
            amount: BigInt(transferModel.amount),
          },
        };
        break;
      }
      case ProposalTypes.SetStakingContract: {
        if (!(addProposalModel instanceof SetStakingContractModel)) {
          throw new Error("You need add SetStakingContractModel");
        }
        const setStakingContractModel =
          addProposalModel as SetStakingContractModel;
        kind = {
          SetStakingContract: {
            staking_id: setStakingContractModel.staking_id,
          },
        };
        break;
      }
      case ProposalTypes.AddBounty: {
        if (!(addProposalModel instanceof AddBountyModel)) {
          throw new Error("You need add AddBountyModel");
        }
        const addBountyModel = addProposalModel as AddBountyModel;
        kind = {
          AddBounty: {
            description: addBountyModel.description,
            token: addBountyModel.token,
            amount: addBountyModel.amount,
            times: addBountyModel.times,
            max_deadline: addBountyModel.max_deadline,
          },
        };
        break;
      }
      case ProposalTypes.BountyDone: {
        if (!(addProposalModel instanceof BountyDoneModel)) {
          throw new Error("You need add BountyDoneModel");
        }
        const bountyDoneModel = addProposalModel as BountyDoneModel;
        kind = {
          BountyDone: {
            bounty_id: bountyDoneModel.bounty_id,
            receiver_id: bountyDoneModel.receiver_id,
          },
        };
        break;
      }
      case ProposalTypes.Vote: {
        kind = {
          Vote: {},
        };
      }
      case ProposalTypes.FactoryInfoUpdate: {
        if (!(addProposalModel instanceof FactoryInfoUpdateModel)) {
          throw new Error("You need add FactoryInfoUpdateModel");
        }
        const factoryInfoUpdateModel =
          addProposalModel as FactoryInfoUpdateModel;
        kind = {
          FactoryInfoUpdate: {
            factory_info: factoryInfoUpdateModel.factory_info,
          },
        };
      }
      case ProposalTypes.ChangePolicyAddOrUpdateRole: {
        if (!(addProposalModel instanceof ChangePolicyAddOrUpdateRoleModel)) {
          throw new Error("You need add ChangePolicyAddOrUpdateRoleModel");
        }
        const changePolicyAddOrUpdateRole =
          addProposalModel as ChangePolicyAddOrUpdateRoleModel;
        kind = {
          ChangePolicyAddOrUpdateRole: {
            role: changePolicyAddOrUpdateRole.role.role,
          },
        };
        break;
      }
      case ProposalTypes.ChangePolicyRemoveRole: {
        if (!(addProposalModel instanceof ChangePolicyRemoveRoleModel)) {
          throw new Error("You need add ChangePolicyRemoveRoleModel");
        }
        const changePolicyRemoveRoleModel =
          addProposalModel as ChangePolicyRemoveRoleModel;
        kind = {
          ChangePolicyRemoveRole: {
            role: changePolicyRemoveRoleModel.roleName,
          },
        };
        break;
      }
      case ProposalTypes.ChangePolicyUpdateDefaultVotePolicy: {
        if (
          !(
            addProposalModel instanceof ChangePolicyUpdateDefaultVotePolicyModel
          )
        ) {
          throw new Error(
            "You need add ChangePolicyUpdateDefaultVotePolicyModel",
          );
        }
        const changePolicyUpdateDefaultVotePolicyModel =
          addProposalModel as ChangePolicyUpdateDefaultVotePolicyModel;
        kind = {
          ChangePolicyUpdateDefaultVotePolicy: {
            vote_policy: addProposalModel.vote_policy,
          },
        };
        break;
      }
      case ProposalTypes.ChangePolicyUpdateParameters: {
        if (!(addProposalModel instanceof ChangePolicyUpdateParametersModel)) {
          throw new Error("You need add ChangePolicyUpdateParametersModel");
        }
        const changePolicyUpdateParametersModel =
          addProposalModel as ChangePolicyUpdateParametersModel;
        kind = changePolicyUpdateParametersModel.parameters;
      }
      default:
        throw new Error("Not supported proposal type");
    }

    const resp = await this.nearWallet.newCallSmartContractFunc({
      contractId: contractId,
      methodName: "add_proposal",
      args: { proposal: { description: description, kind: kind } },
      gas: gas,
      deposit: deposit,
    });
  }
}

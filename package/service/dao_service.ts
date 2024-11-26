import { json } from "stream/consumers";
import {
  ActProposalModel,
  AddBountyModel,
  AddMemberToRoleModel,
  AddProposalModel,
  BlockChainResponse,
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

  async createDaoManager({
    name,
    purpose,
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
    const res = this.nearWallet.callSmartContractFunc({
      contractId: "sputnik-v2.testnet",
      changeMethodName: "create",
      args: {
        name: name,
        args: encodedArgs,
      },
      deposit: "5000000000000000000000000",
    });
    console.log(res);
  }

  async getPolicy({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    try {
      const resp = await this.nearWallet.callSmartContractFunc({
        contractId: contractId,
        viewMethodName: "get_policy",
        deposit: "0",
      });
      return resp;
    } catch (error) {
      throw new Error(`Error get policy: ${error.message}`, error);
    }
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
        break;
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
            amount: transferModel.amount,
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
            bounty: {
              description: addBountyModel.description,
              token: addBountyModel.token,
              amount: addBountyModel.amount,
              times: addBountyModel.times,
              max_deadline: addBountyModel.max_deadline,
            },
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
        break;
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
        break;
      }
      default:
        throw new Error("Not supported proposal type");
    }

    const resp = await this.nearWallet.callSmartContractFunc({
      contractId: contractId,
      changeMethodName: "add_proposal",
      args: { proposal: { description: description, kind: kind } },
      gas: gas,
      deposit: deposit,
    });
  }

  /**
   * @getProposalByID Proposal details by passing the ID or index of a given proposal.
   * @param contractId
   * @param id
   */
  async getProposalByID({
    contractId,
    id,
  }: {
    contractId: string;
    id: number;
  }): Promise<BlockChainResponse> {
    try {
      const res = await this.nearWallet.callSmartContractFunc({
        contractId: contractId,
        viewMethodName: "get_proposal",
        args: { id: id },
      });
      return res;
    } catch (error) {
      throw new Error(`Error get proposal by id: ${error.message}`, error);
    }
  }

  /**
   * @getMultipleProposals Multiple proposal details by passing the index ("ID") starting point and a limit of how many records you would like returned.
   * @param contractId
   * @param from_index
   * @param limit
   */
  async getMultipleProposals({
    contractId,
    from_index,
    limit,
  }: {
    contractId: string;
    from_index: number;
    limit: number;
  }): Promise<BlockChainResponse> {
    try {
      const res = await this.nearWallet.callSmartContractFunc({
        contractId: contractId,
        viewMethodName: "get_proposals",
        args: { from_index: from_index, limit: limit },
      });
      return res;
    } catch (error) {
      throw new Error(`Error get multiple proposals: ${error.message}`, error);
    }
  }

  /**
   * @getLastProposalId Retrieving the last propose ID
   * @param contractId
   * @returns
   */
  async getLastProposalId({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    try {
      const res = await this.nearWallet.callSmartContractFunc({
        contractId: contractId,
        viewMethodName: "get_last_proposal_id",
      });
      return res;
    } catch (error) {
      throw new Error(`Error get last proposal id: ${error.message}`, error);
    }
  }

  /**
   * @actProposal This function is responsible for the action we can do on the proposal
   * @param contractId id of the contract to be acted upon
   * @param id id proposal
   * @param action The action to be taken (VoteApprove, VoteReject, VoteRemove)
   */
  async actProposal({
    contractId,
    id,
    action,
  }: {
    contractId: string;
    id: number;
    action: ActProposalModel;
  }) {
    const res = await this.nearWallet.callSmartContractFunc({
      contractId: contractId,
      changeMethodName: "act_proposal",
      args: { id: id, action: action.toString() },
    });
  }

  /**
   * @getBounty Get bounty list
   * @param contractId
   */
  async getBounty({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    try {
      const res = await this.nearWallet.callSmartContractFunc({
        contractId: contractId,
        viewMethodName: "get_bounties",
      });
      return res;
    } catch (error) {
      throw new Error(`Error get bounty: ${error.message}`, error);
    }
  }

  /**
   * @claimBounty To take on the bounty
   * @param contractId
   * @param id
   * @param deadline The time it will take for the performer to complete the bounty.
   */
  async claimBounty({
    contractId,
    id,
    deadline,
  }: {
    contractId: string;
    id: number;
    deadline: string;
  }) {
    const res = await this.nearWallet.callSmartContractFunc({
      contractId: contractId,
      changeMethodName: "bounty_claim",
      args: { id: id, deadline: deadline },
    });
  }

  /**
   * @giveupBounty If the performer decides to withdraw from the assignment
   * @param id
   */
  async giveUpBounty({ contractId, id }: { contractId: string; id: number }) {
    const res = await this.nearWallet.callSmartContractFunc({
      contractId: contractId,
      changeMethodName: "bounty_giveup",
      args: { id: id },
    });
  }

  /**
   * @doneBounty Called upon completion of the bounty
   * @param contractId
   * @param id
   */
  async doneBounty({ contractId, id }: { contractId: string; id: number }) {
    const res = await this.nearWallet.callSmartContractFunc({
      contractId: contractId,
      changeMethodName: "bounty_done",
      args: { id: id },
    });
  }

  async getBalance({ accountId }: { accountId: string }): Promise<string> {
    if (this.nearWallet == null) {
      throw new Error("Wallet connection is absent");
    }
    try {
      const account = await this.nearWallet.nearConnection!.account(accountId);
      const balance = await account.getAccountBalance();
      const test =
        BigInt(balance.available) -
        BigInt(balance.stateStaked) -
        BigInt(balance.staked);
      return test.toString();
    } catch (error) {
      throw new Error("Error while get balance", error);
    }
  }
}

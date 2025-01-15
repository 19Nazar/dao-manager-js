"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const near_models_1 = require("../models/near_models");
const near_wallet_1 = __importDefault(require("../network/near_wallet"));
class DaoService {
    constructor({ nearWallet }) {
        this.nearWallet = nearWallet;
    }
    static getInstance() {
        if (!DaoService.instance) {
            DaoService.instance = new DaoService({
                nearWallet: near_wallet_1.default.getInstance(),
            });
        }
        return DaoService.instance;
    }
    async createDaoManager({ name, purpose, metadata = "", policy = [], deposit = "5500000000000000000000000", }) {
        const args = JSON.stringify({
            config: {
                name: name,
                purpose: purpose,
                metadata: Buffer.from(metadata).toString("base64"),
            },
            policy: policy,
        });
        const encodedArgs = Buffer.from(args).toString("base64");
        const res = this.nearWallet.callSmartContractFunc({
            contractId: "dao-manager.testnet",
            changeMethodName: "create",
            args: {
                name: name,
                args: encodedArgs,
            },
            deposit: deposit,
        });
        console.log(res);
    }
    async getPolicy({ contractId, }) {
        try {
            const resp = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_policy",
                deposit: "0",
            });
            return resp;
        }
        catch (error) {
            throw new Error(`Error get policy: ${error.message}`);
        }
    }
    async addProposal({ contractId, description, gas, deposit, proposalTypes, addProposalModel, }) {
        let kind;
        switch (proposalTypes) {
            case near_models_1.ProposalTypes.AddMemberToRole: {
                if (!(addProposalModel instanceof near_models_1.AddMemberToRoleModel)) {
                    throw new Error("You need add AddMemberToRoleModel");
                }
                const addMemberToRole = addProposalModel;
                kind = {
                    AddMemberToRole: {
                        member_id: addMemberToRole.member_id,
                        role: addMemberToRole.role,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.RemoveMemberFromRole: {
                if (!(addProposalModel instanceof near_models_1.RemoveMemberFromRoleModel)) {
                    throw new Error("You need add RemoveMemberFromRoleModel");
                }
                const removeMemberFromRoleModel = addProposalModel;
                kind = {
                    RemoveMemberFromRole: {
                        member_id: removeMemberFromRoleModel.member_id,
                        role: removeMemberFromRoleModel.role,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangeConfig: {
                if (!(addProposalModel instanceof near_models_1.ChangeConfigModel)) {
                    throw new Error("You need add ChangeConfigModel");
                }
                const changeConfigModel = addProposalModel;
                kind = {
                    ChangeConfig: {
                        config: {
                            name: changeConfigModel.name,
                            purpose: changeConfigModel.purpose,
                            metadata: changeConfigModel.metadata,
                        },
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangePolicy: {
                if (!(addProposalModel instanceof near_models_1.ChangePolicyModel)) {
                    throw new Error("You need add ChangePolicyModel");
                }
                const changePolicyModel = addProposalModel;
                kind = {
                    ChangePolicy: {
                        policy: changePolicyModel.policyParameters,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.FunctionCall: {
                if (!(addProposalModel instanceof near_models_1.FunctionCallModel)) {
                    throw new Error("You need add FunctionCallModel");
                }
                const functionCallModel = addProposalModel;
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
            case near_models_1.ProposalTypes.UpgradeSelf: {
                if (!(addProposalModel instanceof near_models_1.UpgradeSelfModel)) {
                    throw new Error("You need add UpgradeSelfModel");
                }
                const upgradeSelfModel = addProposalModel;
                kind = {
                    UpgradeSelf: {
                        hash: upgradeSelfModel.hash,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.UpgradeRemote: {
                if (!(addProposalModel instanceof near_models_1.UpgradeRemoteModel)) {
                    throw new Error("You need add UpgradeRemoteModel");
                }
                const upgradeRemoteModel = addProposalModel;
                kind = {
                    UpgradeRemote: {
                        receiver_id: upgradeRemoteModel.receiver_id,
                        method_name: upgradeRemoteModel.method_name,
                        hash: upgradeRemoteModel.hash,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.Transfer: {
                if (!(addProposalModel instanceof near_models_1.TransferModel)) {
                    throw new Error("You need add TransferModel");
                }
                const transferModel = addProposalModel;
                kind = {
                    Transfer: {
                        token_id: transferModel.token_id,
                        receiver_id: transferModel.receiver_id,
                        amount: transferModel.amount,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.SetStakingContract: {
                if (!(addProposalModel instanceof near_models_1.SetStakingContractModel)) {
                    throw new Error("You need add SetStakingContractModel");
                }
                const setStakingContractModel = addProposalModel;
                kind = {
                    SetStakingContract: {
                        staking_id: setStakingContractModel.staking_id,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.AddBounty: {
                if (!(addProposalModel instanceof near_models_1.AddBountyModel)) {
                    throw new Error("You need add AddBountyModel");
                }
                const addBountyModel = addProposalModel;
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
            case near_models_1.ProposalTypes.BountyDone: {
                if (!(addProposalModel instanceof near_models_1.BountyDoneModel)) {
                    throw new Error("You need add BountyDoneModel");
                }
                const bountyDoneModel = addProposalModel;
                kind = {
                    BountyDone: {
                        bounty_id: bountyDoneModel.bounty_id,
                        receiver_id: bountyDoneModel.receiver_id,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.Vote: {
                kind = {
                    Vote: {},
                };
            }
            case near_models_1.ProposalTypes.FactoryInfoUpdate: {
                if (!(addProposalModel instanceof near_models_1.FactoryInfoUpdateModel)) {
                    throw new Error("You need add FactoryInfoUpdateModel");
                }
                const factoryInfoUpdateModel = addProposalModel;
                kind = {
                    FactoryInfoUpdate: {
                        factory_info: factoryInfoUpdateModel.factory_info,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangePolicyAddOrUpdateRole: {
                if (!(addProposalModel instanceof near_models_1.ChangePolicyAddOrUpdateRoleModel)) {
                    throw new Error("You need add ChangePolicyAddOrUpdateRoleModel");
                }
                const changePolicyAddOrUpdateRole = addProposalModel;
                kind = {
                    ChangePolicyAddOrUpdateRole: {
                        role: changePolicyAddOrUpdateRole.role.role,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangePolicyRemoveRole: {
                if (!(addProposalModel instanceof near_models_1.ChangePolicyRemoveRoleModel)) {
                    throw new Error("You need add ChangePolicyRemoveRoleModel");
                }
                const changePolicyRemoveRoleModel = addProposalModel;
                kind = {
                    ChangePolicyRemoveRole: {
                        role: changePolicyRemoveRoleModel.roleName,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangePolicyUpdateDefaultVotePolicy: {
                if (!(addProposalModel instanceof near_models_1.ChangePolicyUpdateDefaultVotePolicyModel)) {
                    throw new Error("You need add ChangePolicyUpdateDefaultVotePolicyModel");
                }
                const changePolicyUpdateDefaultVotePolicyModel = addProposalModel;
                kind = {
                    ChangePolicyUpdateDefaultVotePolicy: {
                        vote_policy: addProposalModel.vote_policy,
                    },
                };
                break;
            }
            case near_models_1.ProposalTypes.ChangePolicyUpdateParameters: {
                if (!(addProposalModel instanceof near_models_1.ChangePolicyUpdateParametersModel)) {
                    throw new Error("You need add ChangePolicyUpdateParametersModel");
                }
                const changePolicyUpdateParametersModel = addProposalModel;
                kind = {
                    ChangePolicyUpdateParameters: {
                        parameters: changePolicyUpdateParametersModel.policyParameters,
                    },
                };
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
    async getProposalByID({ contractId, id, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_proposal",
                args: { id: id },
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get proposal by id: ${error.message}`);
        }
    }
    /**
     * @getMultipleProposals Multiple proposal details by passing the index ("ID") starting point and a limit of how many records you would like returned.
     * @param contractId
     * @param from_index
     * @param limit
     */
    async getMultipleProposals({ contractId, from_index, limit, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_proposals",
                args: { from_index: from_index, limit: limit },
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get multiple proposals: ${error.message}`);
        }
    }
    /**
     * @getLastProposalId Retrieving the last propose ID
     * @param contractId
     * @returns
     */
    async getLastProposalId({ contractId, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_last_proposal_id",
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get last proposal id: ${error.message}`);
        }
    }
    /**
     * @actProposal This function is responsible for the action we can do on the proposal
     * @param contractId id of the contract to be acted upon
     * @param id id proposal
     * @param action The action to be taken (VoteApprove, VoteReject, VoteRemove)
     */
    async actProposal({ contractId, id, action, }) {
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
    async getBounties({ contractId, from_index, limit, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_bounties",
                args: { from_index: from_index, limit: limit },
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get bounties: ${error.message}`);
        }
    }
    /**
     * @getBountyByID Bounty details by passing the ID or index of a given bounty.
     * @param contractId
     * @param id
     */
    async getBountyByID({ contractId, id, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_bounty",
                args: { id: id },
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get proposal by id: ${error.message}`);
        }
    }
    /**
     * @getLastProposalId Retrieving the last bounty ID
     * @param contractId
     * @returns
     */
    async getLastBountyId({ contractId, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: contractId,
                viewMethodName: "get_last_bounty_id",
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get last proposal id: ${error.message}`);
        }
    }
    /**
     * @claimBounty To take on the bounty
     * @param contractId
     * @param id
     * @param deadline The time it will take for the performer to complete the bounty.
     */
    async claimBounty({ contractId, id, deadline, deposit, }) {
        const res = await this.nearWallet.callSmartContractFunc({
            deposit: deposit,
            contractId: contractId,
            changeMethodName: "bounty_claim",
            args: { id: id, deadline: deadline },
        });
    }
    /**
     * @giveupBounty If the performer decides to withdraw from the assignment
     * @param id
     */
    async giveUpBounty({ contractId, id, deposit, }) {
        const res = await this.nearWallet.callSmartContractFunc({
            deposit: deposit,
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
    async doneBounty({ contractId, id, deposit, }) {
        const res = await this.nearWallet.callSmartContractFunc({
            deposit: deposit,
            contractId: contractId,
            changeMethodName: "bounty_done",
            args: { id: id },
        });
    }
    async getBalance({ accountId }) {
        if (this.nearWallet == null) {
            throw new Error("Wallet connection is absent");
        }
        try {
            const account = await this.nearWallet.nearConnection.account(accountId);
            const balance = await account.getAccountBalance();
            const test = BigInt(balance.available) -
                BigInt(balance.stateStaked) -
                BigInt(balance.staked);
            return test.toString();
        }
        catch (error) {
            throw new Error(`Error while get balance ${error.message}`);
        }
    }
    async getDAOConfig({ daoID, }) {
        try {
            const res = await this.nearWallet.callSmartContractFunc({
                contractId: daoID,
                viewMethodName: "get_config",
            });
            return res;
        }
        catch (error) {
            throw new Error(`Error get proposal by id: ${error.message}`);
        }
    }
}
exports.default = DaoService;
DaoService.instance = null;
//# sourceMappingURL=dao_service.js.map
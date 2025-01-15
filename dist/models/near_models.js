"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActProposalModel = exports.ChangePolicyModel = exports.ChangePolicyUpdateParametersModel = exports.WeightKind = exports.VotePolicy = exports.ChangePolicyUpdateDefaultVotePolicyModel = exports.ChangePolicyRemoveRoleModel = exports.AllKind = exports.KindDefault = exports.Role = exports.ChangePolicyAddOrUpdateRoleModel = exports.FactoryInfoUpdateModel = exports.BountyDoneModel = exports.AddBountyModel = exports.VoteModel = exports.SetStakingContractModel = exports.TransferModel = exports.UpgradeRemoteModel = exports.UpgradeSelfModel = exports.FunctionCallModel = exports.RemoveMemberFromRoleModel = exports.ChangeConfigModel = exports.AddMemberToRoleModel = exports.ProposalTypes = exports.ConnectionType = exports.Status = exports.BlockChainResponse = exports.NetworkID = void 0;
class NearModels {
}
var NetworkID;
(function (NetworkID) {
    NetworkID["mainnet"] = "mainnet";
    NetworkID["testnet"] = "testnet";
})(NetworkID = exports.NetworkID || (exports.NetworkID = {}));
class BlockChainResponse {
    constructor({ status, data }) {
        this.status = status;
        this.data = data;
    }
}
exports.BlockChainResponse = BlockChainResponse;
var Status;
(function (Status) {
    Status[Status["successful"] = 0] = "successful";
    Status[Status["error"] = 1] = "error";
})(Status = exports.Status || (exports.Status = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["default"] = 0] = "default";
    ConnectionType[ConnectionType["wallet"] = 1] = "wallet";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
var ProposalTypes;
(function (ProposalTypes) {
    ProposalTypes[ProposalTypes["ChangeConfig"] = 0] = "ChangeConfig";
    ProposalTypes[ProposalTypes["ChangePolicy"] = 1] = "ChangePolicy";
    ProposalTypes[ProposalTypes["AddMemberToRole"] = 2] = "AddMemberToRole";
    ProposalTypes[ProposalTypes["RemoveMemberFromRole"] = 3] = "RemoveMemberFromRole";
    ProposalTypes[ProposalTypes["FunctionCall"] = 4] = "FunctionCall";
    ProposalTypes[ProposalTypes["UpgradeSelf"] = 5] = "UpgradeSelf";
    ProposalTypes[ProposalTypes["UpgradeRemote"] = 6] = "UpgradeRemote";
    ProposalTypes[ProposalTypes["Transfer"] = 7] = "Transfer";
    ProposalTypes[ProposalTypes["SetStakingContract"] = 8] = "SetStakingContract";
    ProposalTypes[ProposalTypes["AddBounty"] = 9] = "AddBounty";
    ProposalTypes[ProposalTypes["BountyDone"] = 10] = "BountyDone";
    ProposalTypes[ProposalTypes["Vote"] = 11] = "Vote";
    ProposalTypes[ProposalTypes["FactoryInfoUpdate"] = 12] = "FactoryInfoUpdate";
    ProposalTypes[ProposalTypes["ChangePolicyAddOrUpdateRole"] = 13] = "ChangePolicyAddOrUpdateRole";
    ProposalTypes[ProposalTypes["ChangePolicyRemoveRole"] = 14] = "ChangePolicyRemoveRole";
    ProposalTypes[ProposalTypes["ChangePolicyUpdateDefaultVotePolicy"] = 15] = "ChangePolicyUpdateDefaultVotePolicy";
    ProposalTypes[ProposalTypes["ChangePolicyUpdateParameters"] = 16] = "ChangePolicyUpdateParameters";
})(ProposalTypes = exports.ProposalTypes || (exports.ProposalTypes = {}));
/**
 * @AddMemberToRole  Used to add a member to a specific role within the DAO.
 * @description  Assigns a role to a participant in the DAO.
 * @param member_id  The ID of the account being added.
 * @param role  The name of the role assigned to the participant.
 */
class AddMemberToRoleModel {
    constructor({ member_id, role }) {
        this.member_id = member_id;
        this.role = role;
    }
}
exports.AddMemberToRoleModel = AddMemberToRoleModel;
/**
 * @ChangeConfig  Used to modify the DAO configuration, including its name, description, or logo.
 * @description  Allows updates to the DAO’s basic information.
 * @param name  The name of the DAO.
 * @param purpose  The purpose or mission of the DAO.
 * @param metadata The metadata for DAO.
 */
class ChangeConfigModel {
    constructor({ name, purpose, metadata = "", }) {
        this.name = name;
        this.purpose = purpose;
        this.metadata = metadata;
    }
}
exports.ChangeConfigModel = ChangeConfigModel;
/**
 * @RemoveMemberFromRoleModel  Used to remove a participant from a specific role.
 * @description  Removes a designated member from the specified role within the contract.
 * @param member_id  The ID of the account that is being removed.
 * @param role  The name of the role from which the member is being removed.
 */
class RemoveMemberFromRoleModel {
    constructor({ member_id, role }) {
        this.member_id = member_id;
        this.role = role;
    }
}
exports.RemoveMemberFromRoleModel = RemoveMemberFromRoleModel;
/**
 * @FunctionCallModel  Used to call a function on a specified contract.
 * @description  Executes a function on a contract by specifying the target, actions, and any required deposit.
 * @param receiver_id  The address of the contract to which the function call is sent.
 * @param actions  A list of actions, each including a method name and its arguments.
 * @param deposit  The amount of NEAR tokens to deposit for this call.
 * @param gas  The amount of gas required for the function call.
 */
class FunctionCallModel {
    constructor({ receiver_id, actions, deposit, gas, }) {
        this.receiver_id = receiver_id;
        this.actions = actions;
        this.deposit = deposit;
        this.gas = gas;
    }
}
exports.FunctionCallModel = FunctionCallModel;
/**
 * @UpgradeSelfModel  Used to update the contract itself.
 * @description  Updates the current contract by loading a new version.
 * @param hash  The hash of the new contract to be loaded into the DAO.
 */
class UpgradeSelfModel {
    constructor({ hash }) {
        this.hash = hash;
    }
}
exports.UpgradeSelfModel = UpgradeSelfModel;
/**
 * @UpgradeRemoteModel  Used to update a remote contract.
 * @description  Updates a specified remote contract by calling an upgrade method.
 * @param receiver_id  The ID of the contract to be updated.
 * @param method_name  The name of the method used for updating.
 * @param hash  The hash of the new contract version to be applied.
 */
class UpgradeRemoteModel {
    constructor({ receiver_id, method_name, hash, }) {
        this.receiver_id = receiver_id;
        this.method_name = method_name;
        this.hash = hash;
    }
}
exports.UpgradeRemoteModel = UpgradeRemoteModel;
/**
 * @TransferModel  Used to transfer funds from a DAO to another account.
 * @description  Transfers a specified amount of tokens from the DAO to a recipient.
 * @param token_id  The ID of the token being transferred.
 * @param receiver_id  The ID of the recipient receiving the funds.
 * @param amount  The number of tokens to be transferred.
 */
class TransferModel {
    constructor({ token_id = "", receiver_id, amount, }) {
        this.token_id = token_id;
        this.receiver_id = receiver_id;
        this.amount = amount;
    }
}
exports.TransferModel = TransferModel;
/**
 * @SetStakingContractModel func. Used to assign a steakage contract.
 * @param staking_id Steakage contract ID
 */
class SetStakingContractModel {
    constructor({ staking_id }) {
        this.staking_id = staking_id;
    }
}
exports.SetStakingContractModel = SetStakingContractModel;
class VoteModel {
}
exports.VoteModel = VoteModel;
/**
 * @AddBountyModel  Used to add a new task with a reward.
 * @description  Adds a new task that rewards participants upon completion.
 * @param token  The token used for the reward.
 * @param amount  The amount of remuneration for completing the task.
 * @param times  The number of participants who can complete the task.
 * @param max_deadline  The maximum period for task completion in days.
 */
class AddBountyModel {
    constructor({ description, token, amount, times, max_deadline, }) {
        this.description = description;
        this.token = token;
        this.amount = amount;
        this.times = times;
        this.max_deadline = max_deadline;
    }
}
exports.AddBountyModel = AddBountyModel;
/**
 * @BountyDoneModel  Used to complete a task with a reward.
 * @param bounty_id  Bounty task ID
 * @param receiver_id Beneficiary ID
 */
class BountyDoneModel {
    constructor({ bounty_id, receiver_id, }) {
        this.bounty_id = bounty_id;
        this.receiver_id = receiver_id;
    }
}
exports.BountyDoneModel = BountyDoneModel;
/**
 * @FactoryInfoUpdateModel func. Used to update factory information.
 * @param factory_info  factory information
 */
class FactoryInfoUpdateModel {
    constructor({ factory_info }) {
        this.factory_info = factory_info;
    }
}
exports.FactoryInfoUpdateModel = FactoryInfoUpdateModel;
/**
 * @ChangePolicyAddOrUpdateRoleModel func. Adds or updates a role in the policy.
 * @param role Role
 */
class ChangePolicyAddOrUpdateRoleModel {
    constructor({ role }) {
        this.role = role;
    }
}
exports.ChangePolicyAddOrUpdateRoleModel = ChangePolicyAddOrUpdateRoleModel;
/**
 * @Role
 * @param name  The name of the role, which must be unique.
 * @param kind  Role Type. This is an enumeration that defines how the membership of the role will be defined:
 * @param permissions  A list of permissions that defines what actions role members can perform.
 * @param vote_policy  Voting policy for certain types of proposals
 */
class Role {
    constructor({ name, kind, permissions, vote_policy = {}, }) {
        this.role = {
            kind: kind.getKind(),
            name: name,
            permissions: permissions,
            vote_policy: vote_policy,
        };
    }
}
exports.Role = Role;
var KindDefault;
(function (KindDefault) {
    KindDefault["Everyone"] = "Everyone";
    KindDefault["Member"] = "Member";
})(KindDefault = exports.KindDefault || (exports.KindDefault = {}));
class AllKind {
    constructor({ kind, group }) {
        if (!kind && !group) {
            throw new Error("Enter at least one parameter ");
        }
        this.kind = kind;
        if (group) {
            this.group = { Group: group };
        }
    }
    getKind() {
        if ((!this.kind && !this.group) || (this.kind && this.group)) {
            throw new Error("You must input one parameter");
        }
        const res = this.kind ? this.kind.toString() : this.group;
        return res;
    }
}
exports.AllKind = AllKind;
/**
 * @ChangePolicyRemoveRoleModel func. Removes the role from the policy.
 * @param roleName  Role name for deletion
 */
class ChangePolicyRemoveRoleModel {
    constructor({ roleName }) {
        this.roleName = roleName;
    }
}
exports.ChangePolicyRemoveRoleModel = ChangePolicyRemoveRoleModel;
/**
 * @ChangePolicyUpdateDefaultVotePolicyModel func. Updates the default voting policy.
 * @param vote_policy  New voting policy
 */
class ChangePolicyUpdateDefaultVotePolicyModel {
    constructor({ vote_policy }) {
        this.vote_policy = vote_policy.votePolicy;
    }
}
exports.ChangePolicyUpdateDefaultVotePolicyModel = ChangePolicyUpdateDefaultVotePolicyModel;
/**
 * @VotePolicy
 * @param weight_kind  Determines the type of weight for votes
 * @param threshold  The threshold of votes required to pass a motion.
 * @param quorum  The value indicating the minimum number of votes required for a quorum.
 * @param weight  The value indicating the weight of the voice.
 */
class VotePolicy {
    constructor({ weight_kind, threshold, quorum, weight, }) {
        this.votePolicy = {
            weight_kind: weight_kind.toString(),
            threshold: threshold.length > 1 ? threshold : threshold[0],
            quorum: quorum,
            weight: weight,
        };
    }
}
exports.VotePolicy = VotePolicy;
/**
 * @WeightKind
 * @param TokenWeight  The weight of votes depends on the number of tokens.
 * @param RoleWeight  The weight of votes is determined according to the role of the participants.
 */
var WeightKind;
(function (WeightKind) {
    WeightKind["TokenWeight"] = "TokenWeight";
    WeightKind["RoleWeight"] = "RoleWeight";
})(WeightKind = exports.WeightKind || (exports.WeightKind = {}));
/**
 * @ChangePolicyUpdateParametersModel func. Updates the parameters of the DAO policy.
 * @param roles  A list of roles defining DAO participant permissions. Each role specifies associated permissions.
 * @param default_vote_policy  The default voting policy for all proposals, determining voting rights and required approval votes.
 * @param proposal_bond  The deposit (in NEAR tokens) required when creating a proposal.
 * @param proposal_period  The active duration (in nanoseconds) for voting proposals.
 * @param bounty_bond  The required deposit for creating a bounty.
 * @param bounty_forgiveness_period  The forgiveness period for bounties (in nanoseconds), during which the bounty can be canceled.
 */
class ChangePolicyUpdateParametersModel {
    constructor({ bounty_forgiveness_period, bounty_bond, proposal_period, proposal_bond, }) {
        this.policyParameters = {
            bounty_forgiveness_period: bounty_forgiveness_period,
            bounty_bond: bounty_bond,
            proposal_period: proposal_period,
            proposal_bond: proposal_bond,
        };
    }
}
exports.ChangePolicyUpdateParametersModel = ChangePolicyUpdateParametersModel;
/**
 * @ChangePolicyModel  Used to update voting rules and access rights within the DAO.
 * @description  Modifies the DAO's governance policy, including roles, voting policies, and bond requirements.
 * @param roles  A list of roles defining DAO participant permissions. Each role specifies associated permissions.
 * @param default_vote_policy  The default voting policy for all proposals, determining voting rights and required approval votes.
 * @param proposal_bond  The deposit (in NEAR tokens) required when creating a proposal.
 * @param proposal_period  The active duration (in nanoseconds) for voting proposals.
 * @param bounty_bond  The required deposit for creating a bounty.
 * @param bounty_forgiveness_period  The forgiveness period for bounties (in nanoseconds), during which the bounty can be canceled.
 */
class ChangePolicyModel {
    constructor({ roles, default_vote_policy, bounty_forgiveness_period, bounty_bond, proposal_period, proposal_bond, }) {
        var newRoles = [];
        for (var role of roles) {
            newRoles.push(role.role);
        }
        this.policyParameters = {
            roles: newRoles,
            default_vote_policy: default_vote_policy.votePolicy,
            bounty_forgiveness_period: bounty_forgiveness_period,
            bounty_bond: bounty_bond,
            proposal_period: proposal_period,
            proposal_bond: proposal_bond,
        };
    }
}
exports.ChangePolicyModel = ChangePolicyModel;
var ActProposalModel;
(function (ActProposalModel) {
    ActProposalModel["VoteApprove"] = "VoteApprove";
    ActProposalModel["VoteReject"] = "VoteReject";
    ActProposalModel["VoteRemove"] = "VoteRemove";
})(ActProposalModel = exports.ActProposalModel || (exports.ActProposalModel = {}));
//# sourceMappingURL=near_models.js.map
export declare enum NetworkID {
    mainnet = "mainnet",
    testnet = "testnet"
}
export declare class BlockChainResponse {
    status: Status;
    data: object;
    constructor({ status, data }: {
        status: Status;
        data: object;
    });
}
export declare enum Status {
    successful = 0,
    error = 1
}
export declare enum ConnectionType {
    default = 0,
    wallet = 1
}
export declare enum ProposalTypes {
    ChangeConfig = 0,
    ChangePolicy = 1,
    AddMemberToRole = 2,
    RemoveMemberFromRole = 3,
    FunctionCall = 4,
    UpgradeSelf = 5,
    UpgradeRemote = 6,
    Transfer = 7,
    SetStakingContract = 8,
    AddBounty = 9,
    BountyDone = 10,
    Vote = 11,
    FactoryInfoUpdate = 12,
    ChangePolicyAddOrUpdateRole = 13,
    ChangePolicyRemoveRole = 14,
    ChangePolicyUpdateDefaultVotePolicy = 15,
    ChangePolicyUpdateParameters = 16
}
export interface AddProposalModel {
}
/**
 * @AddMemberToRole  Used to add a member to a specific role within the DAO.
 * @description  Assigns a role to a participant in the DAO.
 * @param member_id  The ID of the account being added.
 * @param role  The name of the role assigned to the participant.
 */
export declare class AddMemberToRoleModel implements AddProposalModel {
    member_id: string;
    role: string;
    constructor({ member_id, role }: {
        member_id: string;
        role: string;
    });
}
/**
 * @ChangeConfig  Used to modify the DAO configuration, including its name, description, or logo.
 * @description  Allows updates to the DAO’s basic information.
 * @param name  The name of the DAO.
 * @param purpose  The purpose or mission of the DAO.
 * @param metadata The metadata for DAO.
 */
export declare class ChangeConfigModel implements AddProposalModel {
    name: string;
    purpose: string;
    metadata: string;
    constructor({ name, purpose, metadata, }: {
        name: string;
        purpose: string;
        metadata?: string;
    });
}
/**
 * @RemoveMemberFromRoleModel  Used to remove a participant from a specific role.
 * @description  Removes a designated member from the specified role within the contract.
 * @param member_id  The ID of the account that is being removed.
 * @param role  The name of the role from which the member is being removed.
 */
export declare class RemoveMemberFromRoleModel implements AddProposalModel {
    member_id: string;
    role: string;
    constructor({ member_id, role }: {
        member_id: string;
        role: string;
    });
}
/**
 * @FunctionCallModel  Used to call a function on a specified contract.
 * @description  Executes a function on a contract by specifying the target, actions, and any required deposit.
 * @param receiver_id  The address of the contract to which the function call is sent.
 * @param actions  A list of actions, each including a method name and its arguments.
 * @param deposit  The amount of NEAR tokens to deposit for this call.
 * @param gas  The amount of gas required for the function call.
 */
export declare class FunctionCallModel implements AddProposalModel {
    receiver_id: string;
    actions: Array<any>;
    deposit: string;
    gas: string;
    constructor({ receiver_id, actions, deposit, gas, }: {
        receiver_id: string;
        actions: Array<any>;
        deposit: string;
        gas: string;
    });
}
/**
 * @UpgradeSelfModel  Used to update the contract itself.
 * @description  Updates the current contract by loading a new version.
 * @param hash  The hash of the new contract to be loaded into the DAO.
 */
export declare class UpgradeSelfModel implements AddProposalModel {
    hash: string;
    constructor({ hash }: {
        hash: string;
    });
}
/**
 * @UpgradeRemoteModel  Used to update a remote contract.
 * @description  Updates a specified remote contract by calling an upgrade method.
 * @param receiver_id  The ID of the contract to be updated.
 * @param method_name  The name of the method used for updating.
 * @param hash  The hash of the new contract version to be applied.
 */
export declare class UpgradeRemoteModel implements AddProposalModel {
    receiver_id: string;
    method_name: string;
    hash: string;
    constructor({ receiver_id, method_name, hash, }: {
        receiver_id: string;
        method_name: string;
        hash: string;
    });
}
/**
 * @TransferModel  Used to transfer funds from a DAO to another account.
 * @description  Transfers a specified amount of tokens from the DAO to a recipient.
 * @param token_id  The ID of the token being transferred.
 * @param receiver_id  The ID of the recipient receiving the funds.
 * @param amount  The number of tokens to be transferred.
 */
export declare class TransferModel implements AddProposalModel {
    token_id: string;
    receiver_id: string;
    amount: string;
    constructor({ token_id, receiver_id, amount, }: {
        token_id?: string;
        receiver_id: string;
        amount: string;
    });
}
/**
 * @SetStakingContractModel func. Used to assign a steakage contract.
 * @param staking_id Steakage contract ID
 */
export declare class SetStakingContractModel implements AddProposalModel {
    staking_id: string;
    constructor({ staking_id }: {
        staking_id: string;
    });
}
export declare class VoteModel implements AddProposalModel {
}
/**
 * @AddBountyModel  Used to add a new task with a reward.
 * @description  Adds a new task that rewards participants upon completion.
 * @param token  The token used for the reward.
 * @param amount  The amount of remuneration for completing the task.
 * @param times  The number of participants who can complete the task.
 * @param max_deadline  The maximum period for task completion in days.
 */
export declare class AddBountyModel implements AddProposalModel {
    description: string;
    token: string;
    amount: string;
    times: number;
    max_deadline: string;
    constructor({ description, token, amount, times, max_deadline, }: {
        description: string;
        token: string;
        amount: string;
        times: number;
        max_deadline: string;
    });
}
/**
 * @BountyDoneModel  Used to complete a task with a reward.
 * @param bounty_id  Bounty task ID
 * @param receiver_id Beneficiary ID
 */
export declare class BountyDoneModel implements AddProposalModel {
    bounty_id: number;
    receiver_id: string;
    constructor({ bounty_id, receiver_id, }: {
        bounty_id: number;
        receiver_id: string;
    });
}
/**
 * @FactoryInfoUpdateModel func. Used to update factory information.
 * @param factory_info  factory information
 */
export declare class FactoryInfoUpdateModel implements AddProposalModel {
    factory_info: string;
    constructor({ factory_info }: {
        factory_info: string;
    });
}
/**
 * @ChangePolicyAddOrUpdateRoleModel func. Adds or updates a role in the policy.
 * @param role Role
 */
export declare class ChangePolicyAddOrUpdateRoleModel implements AddProposalModel {
    role: Role;
    constructor({ role }: {
        role: Role;
    });
}
/**
 * @Role
 * @param name  The name of the role, which must be unique.
 * @param kind  Role Type. This is an enumeration that defines how the membership of the role will be defined:
 * @param permissions  A list of permissions that defines what actions role members can perform.
 * @param vote_policy  Voting policy for certain types of proposals
 */
export declare class Role {
    role: object;
    constructor({ name, kind, permissions, vote_policy, }: {
        name: string;
        kind: AllKind;
        permissions: Array<string>;
        vote_policy?: object;
    });
}
export declare enum KindDefault {
    Everyone = "Everyone",
    Member = "Member"
}
export declare class AllKind {
    kind?: KindDefault;
    group?: {
        Group: Array<string>;
    };
    constructor({ kind, group }: {
        kind?: KindDefault;
        group?: Array<string>;
    });
    getKind(): any;
}
/**
 * @ChangePolicyRemoveRoleModel func. Removes the role from the policy.
 * @param roleName  Role name for deletion
 */
export declare class ChangePolicyRemoveRoleModel implements AddProposalModel {
    roleName: string;
    constructor({ roleName }: {
        roleName: string;
    });
}
/**
 * @ChangePolicyUpdateDefaultVotePolicyModel func. Updates the default voting policy.
 * @param vote_policy  New voting policy
 */
export declare class ChangePolicyUpdateDefaultVotePolicyModel implements AddProposalModel {
    vote_policy: object;
    constructor({ vote_policy }: {
        vote_policy: VotePolicy;
    });
}
/**
 * @VotePolicy
 * @param weight_kind  Determines the type of weight for votes
 * @param threshold  The threshold of votes required to pass a motion.
 * @param quorum  The value indicating the minimum number of votes required for a quorum.
 * @param weight  The value indicating the weight of the voice.
 */
export declare class VotePolicy {
    votePolicy: object;
    constructor({ weight_kind, threshold, quorum, weight, }: {
        weight_kind: WeightKind;
        threshold: Array<number>;
        quorum?: string;
        weight?: number;
    });
}
/**
 * @WeightKind
 * @param TokenWeight  The weight of votes depends on the number of tokens.
 * @param RoleWeight  The weight of votes is determined according to the role of the participants.
 */
export declare enum WeightKind {
    TokenWeight = "TokenWeight",
    RoleWeight = "RoleWeight"
}
/**
 * @ChangePolicyUpdateParametersModel func. Updates the parameters of the DAO policy.
 * @param roles  A list of roles defining DAO participant permissions. Each role specifies associated permissions.
 * @param default_vote_policy  The default voting policy for all proposals, determining voting rights and required approval votes.
 * @param proposal_bond  The deposit (in NEAR tokens) required when creating a proposal.
 * @param proposal_period  The active duration (in nanoseconds) for voting proposals.
 * @param bounty_bond  The required deposit for creating a bounty.
 * @param bounty_forgiveness_period  The forgiveness period for bounties (in nanoseconds), during which the bounty can be canceled.
 */
export declare class ChangePolicyUpdateParametersModel implements AddProposalModel {
    policyParameters: object;
    constructor({ bounty_forgiveness_period, bounty_bond, proposal_period, proposal_bond, }: {
        bounty_forgiveness_period?: string;
        bounty_bond?: string;
        proposal_period?: string;
        proposal_bond: string;
    });
}
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
export declare class ChangePolicyModel implements AddProposalModel {
    policyParameters: object;
    constructor({ roles, default_vote_policy, bounty_forgiveness_period, bounty_bond, proposal_period, proposal_bond, }: {
        roles: Array<Role>;
        default_vote_policy: VotePolicy;
        bounty_forgiveness_period: string;
        bounty_bond: string;
        proposal_period: string;
        proposal_bond: string;
    });
}
export declare enum ActProposalModel {
    VoteApprove = "VoteApprove",
    VoteReject = "VoteReject",
    VoteRemove = "VoteRemove"
}

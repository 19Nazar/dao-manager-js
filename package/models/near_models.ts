class NearModels {}

export enum NetworkID {
  mainnet,
  testnet,
}

export class BlockChainResponse {
  status: string;
  data: object;

  constructor({ status, data }: { status: string; data: object }) {
    this.status = status;
    this.data = data;
  }
}

export enum ProposalTypes {
  ChangeConfig,
  ChangePolicy,
  AddMemberToRole,
  RemoveMemberFromRole,
  FunctionCall,
  UpgradeSelf,
  UpgradeRemote,
  Transfer,
  SetStakingContract,
  AddBounty,
  BountyDone,
  Vote,
  FactoryInfoUpdate,
  ChangePolicyAddOrUpdateRole,
  ChangePolicyRemoveRole,
  ChangePolicyUpdateDefaultVotePolicy,
  ChangePolicyUpdateParameters,
}

export interface AddProposalModel {}

/**
 * @AddMemberToRole  Used to add a member to a specific role within the DAO.
 * @description  Assigns a role to a participant in the DAO.
 * @param member_id  The ID of the account being added.
 * @param role  The name of the role assigned to the participant.
 */
export class AddMemberToRoleModel implements AddProposalModel {
  member_id: string;
  role: string;
  constructor({ member_id, role }: { member_id: string; role: string }) {
    this.member_id = member_id;
    this.role = role;
  }
}

/**
 * @ChangeConfig  Used to modify the DAO configuration, including its name, description, or logo.
 * @description  Allows updates to the DAO’s basic information.
 * @param name  The name of the DAO.
 * @param purpose  The purpose or mission of the DAO.
 */
export class ChangeConfigModel implements AddProposalModel {
  name: string; // Name DAO
  purpose: string;
  metadata: string;

  constructor({
    name,
    purpose,
    metadata,
  }: {
    name: string;
    purpose: string;
    metadata: string;
  }) {
    this.name = name;
    this.purpose = purpose;
    this.metadata = metadata;
  }
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
export class ChangePolicyModel implements AddProposalModel {
  roles: Array<any>;
  default_vote_policy: Map<string, any>;
  proposal_bond: string;
  proposal_period: string;
  bounty_bond: string;
  bounty_forgiveness_period: string;

  constructor({
    roles,
    default_vote_policy,
    proposal_bond,
    proposal_period,
    bounty_bond,
    bounty_forgiveness_period,
  }: {
    roles: Array<Role>;
    default_vote_policy: Map<string, any>;
    proposal_bond: string;
    proposal_period: string;
    bounty_bond: string;
    bounty_forgiveness_period: string;
  }) {
    this.roles = [];
    for (var role of roles) {
      this.roles.push(role.role);
    }
    this.default_vote_policy = default_vote_policy;
    this.proposal_bond = proposal_bond;
    this.proposal_period = proposal_period;
    this.bounty_bond = bounty_bond;
    this.bounty_forgiveness_period = bounty_forgiveness_period;
  }
}

/**
 * @RemoveMemberFromRoleModel  Used to remove a participant from a specific role.
 * @description  Removes a designated member from the specified role within the contract.
 * @param member_id  The ID of the account that is being removed.
 * @param role  The name of the role from which the member is being removed.
 */
export class RemoveMemberFromRoleModel implements AddProposalModel {
  member_id: string;
  role: string;
  constructor({ member_id, role }: { member_id: string; role: string }) {
    this.member_id = member_id;
    this.role = role;
  }
}

/**
 * @FunctionCallModel  Used to call a function on a specified contract.
 * @description  Executes a function on a contract by specifying the target, actions, and any required deposit.
 * @param receiver_id  The address of the contract to which the function call is sent.
 * @param actions  A list of actions, each including a method name and its arguments.
 * @param deposit  The amount of NEAR tokens to deposit for this call.
 * @param gas  The amount of gas required for the function call.
 */
export class FunctionCallModel implements AddProposalModel {
  receiver_id: string;
  actions: Array<any>;
  deposit: string;
  gas: string;

  constructor({
    receiver_id,
    actions,
    deposit,
    gas,
  }: {
    receiver_id: string;
    actions: Array<any>;
    deposit: string;
    gas: string;
  }) {
    this.receiver_id = receiver_id;
    this.actions = actions;
    this.deposit = deposit;
    this.gas = gas;
  }
}

/**
 * @UpgradeSelfModel  Used to update the contract itself.
 * @description  Updates the current contract by loading a new version.
 * @param hash  The hash of the new contract to be loaded into the DAO.
 */
export class UpgradeSelfModel implements AddProposalModel {
  hash: string;
  constructor({ hash }: { hash: string }) {
    this.hash = hash;
  }
}

/**
 * @UpgradeRemoteModel  Used to update a remote contract.
 * @description  Updates a specified remote contract by calling an upgrade method.
 * @param receiver_id  The ID of the contract to be updated.
 * @param method_name  The name of the method used for updating.
 * @param hash  The hash of the new contract version to be applied.
 */
export class UpgradeRemoteModel implements AddProposalModel {
  receiver_id: string;
  method_name: string;
  hash: string;
  constructor({
    receiver_id,
    method_name,
    hash,
  }: {
    receiver_id: string;
    method_name: string;
    hash: string;
  }) {
    this.receiver_id = receiver_id;
    this.method_name = method_name;
    this.hash = hash;
  }
}

/**
 * @TransferModel  Used to transfer funds from a DAO to another account.
 * @description  Transfers a specified amount of tokens from the DAO to a recipient.
 * @param token_id  The ID of the token being transferred.
 * @param receiver_id  The ID of the recipient receiving the funds.
 * @param amount  The number of tokens to be transferred.
 */
export class TransferModel implements AddProposalModel {
  token_id: string;
  receiver_id: string;
  amount: string;

  constructor({
    token_id,
    receiver_id,
    amount,
  }: {
    token_id: string;
    receiver_id: string;
    amount: string;
  }) {
    this.token_id = token_id;
    this.receiver_id = receiver_id;
    this.amount = amount;
  }
}

/**
 * @SetStakingContractModel func. Used to assign a steakage contract.
 * @param staking_id Steakage contract ID
 */
export class SetStakingContractModel implements AddProposalModel {
  staking_id: string;
  constructor({ staking_id }: { staking_id: string }) {
    this.staking_id = staking_id;
  }
}

/**
 * @AddBountyModel  Used to add a new task with a reward.
 * @description  Adds a new task that rewards participants upon completion.
 * @param token  The token used for the reward.
 * @param amount  The amount of remuneration for completing the task.
 * @param times  The number of participants who can complete the task.
 * @param max_deadline  The maximum period for task completion in days.
 */
export class AddBountyModel implements AddProposalModel {
  description: string;
  token: string;
  amount: string;
  times: number;
  max_deadline: number;
  constructor({
    description,
    token,
    amount,
    times,
    max_deadline,
  }: {
    description: string;
    token: string;
    amount: string;
    times: number;
    max_deadline: number;
  }) {
    this.description = description;
    this.token = token;
    this.amount = amount;
    this.times = times;
    this.max_deadline = max_deadline;
  }
}

/**
 * @BountyDoneModel  Used to complete a task with a reward.
 * @param bounty_id  Bounty task ID
 * @param receiver_id Beneficiary ID
 */
export class BountyDoneModel implements AddProposalModel {
  bounty_id: number;
  receiver_id: string;
  constructor({
    bounty_id,
    receiver_id,
  }: {
    bounty_id: number;
    receiver_id: string;
  }) {
    this.bounty_id = bounty_id;
    this.receiver_id = receiver_id;
  }
}

/**
 * @FactoryInfoUpdateModel func. Used to update factory information.
 * @param factory_info  factory information
 */
export class FactoryInfoUpdateModel implements AddProposalModel {
  factory_info: string;
  constructor({ factory_info }: { factory_info: string }) {
    this.factory_info = factory_info;
  }
}

/**
 * @ChangePolicyAddOrUpdateRoleModel func. Adds or updates a role in the policy.
 * @param role Role
 */
export class ChangePolicyAddOrUpdateRoleModel implements AddProposalModel {
  role: Role;
  constructor({ role }: { role: Role }) {
    this.role = role;
  }
}

/**
 * @Role
 * @param name  The name of the role, which must be unique.
 * @param kind  Role Type. This is an enumeration that defines how the membership of the role will be defined:
 * @param permissions  A list of permissions that defines what actions role members can perform.
 * @param vote_policy  Voting policy for certain types of proposals
 * @param balance  An optional parameter that specifies the minimum balance required for a member to perform certain actions described in permissions.
 */
export class Role {
  role: object;
  constructor({
    name,
    kind,
    permissions,
    vote_policy,
    balance,
  }: {
    name: string;
    kind: AllKind;
    permissions: Array<string>;
    vote_policy: Map<string, any>;
    balance?: string;
  }) {
    this.role = {
      kind: kind.getKind(),
      name: name,
      permissions: permissions,
      vote_policy: vote_policy,
      balance: balance,
    };
  }
}

export enum KindDefault {
  Everyone = "Everyone",
  Member = "Member",
}

export class AllKind {
  kind?: KindDefault;
  group?: { Group: Array<string> };

  constructor({ kind, group }: { kind?: KindDefault; group?: Array<string> }) {
    if (!kind && !group) {
      throw new Error("Enter at least one parameter ");
    }
    this.kind = kind;
    if (group) {
      this.group = { Group: group };
    }
  }

  getKind(): any {
    const res = this.kind ? this.kind.toString() : this.group;
    return res;
  }
}

/**
 * @ChangePolicyRemoveRoleModel func. Removes the role from the policy.
 * @param roleName  Role name for deletion
 */
export class ChangePolicyRemoveRoleModel implements AddProposalModel {
  roleName: string;

  constructor({ roleName }: { roleName: string }) {
    this.roleName = roleName;
  }
}

/**
 * @ChangePolicyUpdateDefaultVotePolicyModel func. Updates the default voting policy.
 * @param vote_policy  New voting policy
 */
export class ChangePolicyUpdateDefaultVotePolicyModel
  implements AddProposalModel
{
  vote_policy: object;
  constructor({ vote_policy }: { vote_policy: VotePolicy }) {
    this.vote_policy = vote_policy.votePolicy;
  }
}

/**
 * @VotePolicy
 * @param weight_kind  Determines the type of weight for votes
 * @param threshold  The threshold of votes required to pass a motion.
 * @param quorum  The value indicating the minimum number of votes required for a quorum.
 * @param weight  The value indicating the weight of the voice.
 */
export class VotePolicy {
  votePolicy: object;

  constructor({
    weight_kind,
    threshold,
    quorum,
    weight,
  }: {
    weight_kind: WeightKind;
    threshold: Array<number>;
    quorum?: number;
    weight?: number;
  }) {
    this.votePolicy = {
      weight_kind: weight_kind.toString(),
      threshold: threshold,
      quorum: quorum,
      weight: weight,
    };
  }
}

/**
 * @WeightKind
 * @param TokenWeight  The weight of votes depends on the number of tokens.
 * @param RoleWeight  The weight of votes is determined according to the role of the participants.
 */
export enum WeightKind {
  TokenWeight = "TokenWeight",
  RoleWeight = "RoleWeight",
}

/**
 * @ChangePolicyUpdateParametersModel func. Updates the parameters of the DAO policy.
 * @param parameters  New policy parameters
 */
export class ChangePolicyUpdateParametersModel implements AddProposalModel {
  parameters: object;
  constructor({ parameters }: { parameters: PolicyParameters }) {
    this.parameters = parameters.policyParameters;
  }
}

/**
 * @PolicyParameters
 * @param proposal_bond  The deposit in tokens required to create an offer.
 * @param proposal_period  The time (in nanoseconds) that the proposal will be active and available for voting.
 * @param bounty_bond  Deposit to place a bounty (bounty).
 * @param bounty_forgiveness_period  The period (in nanoseconds) during which participants can avoid a penalty for failing to perform on an award.
 * @param default_vote_policy  The default voting policy for DAOs.
 * @param roles  A list of roles (Role structures) that define the rights of participants in the DAO, such as permission to create proposals, vote, and perform other actions.
 */
export class PolicyParameters {
  policyParameters: object;
  constructor({
    roles,
    default_vote_policy,
    bounty_forgiveness_period,
    bounty_bond,
    proposal_period,
    proposal_bond,
  }: {
    roles: Array<Role>;
    default_vote_policy: VotePolicy;
    bounty_forgiveness_period: BigInt;
    bounty_bond: BigInt;
    proposal_period: BigInt;
    proposal_bond: BigInt;
  }) {
    var newRoles: Array<any> = [];
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

export enum ActProposalModel {
  VoteApprove = "VoteApprove",
  VoteReject = "VoteReject",
  VoteRemove = "VoteRemove",
}

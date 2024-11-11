import { utils } from "near-api-js";
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

export class AddMemberToRole {
  member_id: string;
  role: string;
  constructor({ member_id, role }: { member_id: string; role: string }) {
    this.member_id = member_id;
    this.role = role;
  }
}

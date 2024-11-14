import {
  ActProposalModel,
  AddProposalModel,
  BlockChainResponse,
  NetworkID,
  ProposalTypes,
} from "./models/near_models";
import NearWallet from "./network/near_wallet";
import DaoService from "./service/dao_service";

export class DaoManagerJS {
  private static instance: DaoManagerJS | null = null;
  nearWallet: NearWallet;
  daoService: DaoService;
  constructor() {
    this.nearWallet = NearWallet.getInstance();
    this.daoService = DaoService.getInstance();
  }
  static getInstance(): DaoManagerJS {
    if (!DaoManagerJS.instance) {
      DaoManagerJS.instance = new DaoManagerJS();
    }
    return DaoManagerJS.instance;
  }

  //WalletInteraction
  async logIn({ networkID }: { networkID: NetworkID }) {
    const res = await this.nearWallet.createWalletConnection({
      networkID: networkID,
    });
  }

  async logOut() {
    this.nearWallet.signOut();
  }

  async checkIsSign(): Promise<boolean> {
    const res = await this.nearWallet.checkIsSign();
    return res;
  }

  async getResultTxns({
    txnHesh,
    accountId,
  }: {
    txnHesh: string;
    accountId?: string;
  }): Promise<BlockChainResponse> {
    const res = await this.nearWallet.getTxnsHeshStatus({
      txnHesh: txnHesh,
      accountId: accountId,
    });
    return res;
  }

  signOut() {
    this.nearWallet.signOut();
  }

  //DAO interaction
  async createDaoMeneger({
    name,
    purpose,
    metadata,
    policy,
  }: {
    name: string;
    purpose: string;
    metadata?: string;
    policy?: Array<string>;
  }) {
    const res = await this.daoService.createDaoMeneger({
      name: name,
      purpose: purpose,
      metadata: metadata,
      policy: policy,
    });
  }

  async getPolicy({ contractId }: { contractId: string }) {
    const res = await this.daoService.getPolicy({ contractId: contractId });
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
    const res = await this.daoService.addProposal({
      contractId: contractId,
      description: description,
      gas: gas,
      deposit: deposit,
      proposalTypes: proposalTypes,
      addProposalModel: addProposalModel,
    });
  }

  async getProposalByID({
    contractId,
    id,
  }: {
    contractId: string;
    id: number;
  }) {
    const res = await this.daoService.getProposalByID({
      contractId: contractId,
      id: id,
    });
  }

  async getMultipleProposals({
    contractId,
    from_index,
    limit,
  }: {
    contractId: string;
    from_index: number;
    limit: number;
  }) {
    const res = await this.daoService.getMultipleProposals({
      contractId: contractId,
      from_index: from_index,
      limit: limit,
    });
  }

  async actProposal({
    contractId,
    id,
    action,
  }: {
    contractId: string;
    id: number;
    action: ActProposalModel;
  }) {
    const res = await this.daoService.actProposal({
      contractId,
      id,
      action,
    });
  }

  async getBounty({ contractId }: { contractId: string }) {
    const res = await this.daoService.getBounty({ contractId: contractId });
  }

  async claimBounty({
    contractId,
    id,
    deadline,
  }: {
    contractId: string;
    id: number;
    deadline: string;
  }) {
    const res = await this.daoService.claimBounty({
      contractId: contractId,
      id: id,
      deadline: deadline,
    });
  }

  async giveUpBounty({ contractId, id }: { contractId: string; id: number }) {
    const res = await this.daoService.giveUpBounty({
      contractId: contractId,
      id: id,
    });
  }

  async doneBounty({ contractId, id }: { contractId: string; id: number }) {
    const res = await this.daoService.doneBounty({
      contractId: contractId,
      id: id,
    });
  }
}

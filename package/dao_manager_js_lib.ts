import {
  ActProposalModel,
  AddProposalModel,
  BlockChainResponse,
  ConnectionType,
  NetworkID,
  ProposalTypes,
} from "./models/near_models";
import NearWallet from "./network/near_wallet";
import DaoService from "./service/dao_service";

export default class DaoManagerJS {
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
  async createConnection({
    connectionType,
    networkID,
    privateKey,
    accountID,
  }: {
    privateKey?: string;
    accountID?: string;
    connectionType: ConnectionType;
    networkID: NetworkID;
  }) {
    const res = await this.nearWallet.createConnection({
      connectionType: connectionType,
      privateKey: privateKey,
      accountID: accountID,
      networkID: networkID,
    });
  }

  async logIn({
    successUrl,
    failureUrl,
  }: {
    successUrl?: string;
    failureUrl?: string;
  }) {
    const res = await this.nearWallet.logIn({
      successUrl: successUrl,
      failureUrl: failureUrl,
    });
  }

  async checkIsSign(): Promise<boolean> {
    const res = await this.nearWallet.checkIsSign();
    return res;
  }

  async createAccessKey({
    nameContract,
    successUrl,
  }: {
    nameContract: string;
    successUrl?: string;
  }) {
    const createKey = await this.nearWallet.createAccessKey({
      nameContract: nameContract,
      successUrl: successUrl,
    });
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
    const res = await this.daoService.createDaoManager({
      name: name,
      purpose: purpose,
      metadata: metadata,
      policy: policy,
    });
  }

  async getPolicy({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    const res = await this.daoService.getPolicy({ contractId: contractId });
    return res;
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
  }): Promise<BlockChainResponse> {
    const res = await this.daoService.getProposalByID({
      contractId: contractId,
      id: id,
    });
    return res;
  }

  async getMultipleProposals({
    contractId,
    from_index,
    limit,
  }: {
    contractId: string;
    from_index: number;
    limit: number;
  }): Promise<BlockChainResponse> {
    const res = await this.daoService.getMultipleProposals({
      contractId: contractId,
      from_index: from_index,
      limit: limit,
    });
    return res;
  }

  async getLastProposalId({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    const res = await this.daoService.getLastProposalId({
      contractId: contractId,
    });
    return res;
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

  async getBounties({
    contractId,
  }: {
    contractId: string;
  }): Promise<BlockChainResponse> {
    const res = await this.daoService.getBounties({ contractId: contractId });
    return res;
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

  async getBalance({ accountId }: { accountId: string }) {
    const balance = await this.daoService.getBalance({ accountId: accountId });
    return balance;
  }

  getAccountID(): string {
    return this.nearWallet.getAccountID();
  }
}

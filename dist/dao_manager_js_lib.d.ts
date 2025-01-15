import { ActProposalModel, AddProposalModel, BlockChainResponse, ConnectionType, NetworkID, ProposalTypes } from "./models/near_models";
import NearWallet from "./network/near_wallet";
import DaoService from "./service/dao_service";
export default class DaoManagerJS {
    private static instance;
    nearWallet: NearWallet;
    daoService: DaoService;
    constructor();
    static getInstance(): DaoManagerJS;
    createConnection({ connectionType, networkID, privateKey, accountID, }: {
        privateKey?: string;
        accountID?: string;
        connectionType: ConnectionType;
        networkID: NetworkID;
    }): Promise<boolean>;
    logIn({ successUrl, failureUrl, }: {
        successUrl?: string;
        failureUrl?: string;
    }): Promise<void>;
    checkIsSign(): Promise<boolean>;
    createAccessKey({ nameContract, successUrl, }: {
        nameContract: string;
        successUrl?: string;
    }): Promise<void>;
    getResultTxns({ txnHesh, accountId, }: {
        txnHesh: string;
        accountId?: string;
    }): Promise<BlockChainResponse>;
    signOut(): void;
    createDaoManager({ name, purpose, metadata, policy, deposit, }: {
        deposit?: string;
        name: string;
        purpose: string;
        metadata?: string;
        policy?: Array<string>;
    }): Promise<void>;
    getPolicy({ contractId, }: {
        contractId: string;
    }): Promise<BlockChainResponse>;
    addProposal({ contractId, description, gas, deposit, proposalTypes, addProposalModel, }: {
        contractId: string;
        description: string;
        gas?: string;
        deposit?: string;
        proposalTypes: ProposalTypes;
        addProposalModel: AddProposalModel;
    }): Promise<void>;
    getProposalByID({ contractId, id, }: {
        contractId: string;
        id: number;
    }): Promise<BlockChainResponse>;
    getMultipleProposals({ contractId, from_index, limit, }: {
        contractId: string;
        from_index: number;
        limit: number;
    }): Promise<BlockChainResponse>;
    getLastProposalId({ contractId, }: {
        contractId: string;
    }): Promise<BlockChainResponse>;
    actProposal({ contractId, id, action, }: {
        contractId: string;
        id: number;
        action: ActProposalModel;
    }): Promise<void>;
    getBounties({ contractId, from_index, limit, }: {
        contractId: string;
        from_index: number;
        limit: number;
    }): Promise<BlockChainResponse>;
    getLastBountyId({ contractId, }: {
        contractId: string;
    }): Promise<BlockChainResponse>;
    claimBounty({ contractId, id, deadline, deposit, }: {
        contractId: string;
        deposit: string;
        id: number;
        deadline: string;
    }): Promise<void>;
    giveUpBounty({ contractId, id, deposit, }: {
        deposit: string;
        contractId: string;
        id: number;
    }): Promise<void>;
    doneBounty({ contractId, id, deposit, }: {
        deposit: string;
        contractId: string;
        id: number;
    }): Promise<void>;
    getBalance({ accountId }: {
        accountId: string;
    }): Promise<string>;
    getAccountID(): string;
    getDAOConfig({ daoID, }: {
        daoID: string;
    }): Promise<BlockChainResponse>;
}

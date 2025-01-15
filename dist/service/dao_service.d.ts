import { ActProposalModel, AddProposalModel, BlockChainResponse, ProposalTypes } from "../models/near_models";
import NearWallet from "../network/near_wallet";
export default class DaoService {
    private static instance;
    nearWallet: NearWallet;
    constructor({ nearWallet }: {
        nearWallet: NearWallet;
    });
    static getInstance(): DaoService;
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
    /**
     * @getProposalByID Proposal details by passing the ID or index of a given proposal.
     * @param contractId
     * @param id
     */
    getProposalByID({ contractId, id, }: {
        contractId: string;
        id: number;
    }): Promise<BlockChainResponse>;
    /**
     * @getMultipleProposals Multiple proposal details by passing the index ("ID") starting point and a limit of how many records you would like returned.
     * @param contractId
     * @param from_index
     * @param limit
     */
    getMultipleProposals({ contractId, from_index, limit, }: {
        contractId: string;
        from_index: number;
        limit: number;
    }): Promise<BlockChainResponse>;
    /**
     * @getLastProposalId Retrieving the last propose ID
     * @param contractId
     * @returns
     */
    getLastProposalId({ contractId, }: {
        contractId: string;
    }): Promise<BlockChainResponse>;
    /**
     * @actProposal This function is responsible for the action we can do on the proposal
     * @param contractId id of the contract to be acted upon
     * @param id id proposal
     * @param action The action to be taken (VoteApprove, VoteReject, VoteRemove)
     */
    actProposal({ contractId, id, action, }: {
        contractId: string;
        id: number;
        action: ActProposalModel;
    }): Promise<void>;
    /**
     * @getBounty Get bounty list
     * @param contractId
     */
    getBounties({ contractId, from_index, limit, }: {
        contractId: string;
        from_index: number;
        limit: number;
    }): Promise<BlockChainResponse>;
    /**
     * @getBountyByID Bounty details by passing the ID or index of a given bounty.
     * @param contractId
     * @param id
     */
    getBountyByID({ contractId, id, }: {
        contractId: string;
        id: number;
    }): Promise<BlockChainResponse>;
    /**
     * @getLastProposalId Retrieving the last bounty ID
     * @param contractId
     * @returns
     */
    getLastBountyId({ contractId, }: {
        contractId: string;
    }): Promise<BlockChainResponse>;
    /**
     * @claimBounty To take on the bounty
     * @param contractId
     * @param id
     * @param deadline The time it will take for the performer to complete the bounty.
     */
    claimBounty({ contractId, id, deadline, deposit, }: {
        deposit: string;
        contractId: string;
        id: number;
        deadline: string;
    }): Promise<void>;
    /**
     * @giveupBounty If the performer decides to withdraw from the assignment
     * @param id
     */
    giveUpBounty({ contractId, id, deposit, }: {
        deposit: string;
        contractId: string;
        id: number;
    }): Promise<void>;
    /**
     * @doneBounty Called upon completion of the bounty
     * @param contractId
     * @param id
     */
    doneBounty({ contractId, id, deposit, }: {
        deposit: string;
        contractId: string;
        id: number;
    }): Promise<void>;
    getBalance({ accountId }: {
        accountId: string;
    }): Promise<string>;
    getDAOConfig({ daoID, }: {
        daoID: string;
    }): Promise<BlockChainResponse>;
}

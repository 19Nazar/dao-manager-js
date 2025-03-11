"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const near_wallet_1 = __importDefault(require("./network/near_wallet"));
const dao_service_1 = __importDefault(require("./service/dao_service"));
class DaoManagerJS {
    constructor({ daoService, nearWallet }) {
        this.nearWallet = nearWallet ?? near_wallet_1.default.getInstance();
        this.daoService = daoService ?? dao_service_1.default.getInstance();
    }
    static getInstance() {
        if (!DaoManagerJS.instance) {
            DaoManagerJS.instance = new DaoManagerJS({});
        }
        return DaoManagerJS.instance;
    }
    //WalletInteraction
    async createConnection({ connectionType, networkID, privateKey, accountID, }) {
        const res = await this.nearWallet.createConnection({
            connectionType: connectionType,
            privateKey: privateKey,
            accountID: accountID,
            networkID: networkID,
        });
        return true;
    }
    async logIn({ successUrl, failureUrl, }) {
        const res = await this.nearWallet.logIn({
            successUrl: successUrl,
            failureUrl: failureUrl,
        });
    }
    async checkIsSign() {
        const res = await this.nearWallet.checkIsSign();
        return res;
    }
    async createAccessKey({ nameContract, successUrl, }) {
        const createKey = await this.nearWallet.createAccessKey({
            nameContract: nameContract,
            successUrl: successUrl,
        });
    }
    async getResultTxns({ txnHesh, accountId, }) {
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
    async createDaoManager({ name, purpose, metadata, policy, deposit, }) {
        const res = await this.daoService.createDaoManager({
            name: name,
            purpose: purpose,
            metadata: metadata,
            policy: policy,
            deposit: deposit,
        });
    }
    async getPolicy({ contractId, }) {
        const res = await this.daoService.getPolicy({ contractId: contractId });
        return res;
    }
    async addProposal({ contractId, description, gas, deposit, proposalTypes, addProposalModel, }) {
        const res = await this.daoService.addProposal({
            contractId: contractId,
            description: description,
            gas: gas,
            deposit: deposit,
            proposalTypes: proposalTypes,
            addProposalModel: addProposalModel,
        });
    }
    async getProposalByID({ contractId, id, }) {
        const res = await this.daoService.getProposalByID({
            contractId: contractId,
            id: id,
        });
        return res;
    }
    async getMultipleProposals({ contractId, from_index, limit, }) {
        const res = await this.daoService.getMultipleProposals({
            contractId: contractId,
            from_index: from_index,
            limit: limit,
        });
        return res;
    }
    async getLastProposalId({ contractId, }) {
        const res = await this.daoService.getLastProposalId({
            contractId: contractId,
        });
        return res;
    }
    async actProposal({ contractId, id, action, }) {
        const res = await this.daoService.actProposal({
            contractId,
            id,
            action,
        });
    }
    async getBounties({ contractId, from_index, limit, }) {
        const res = await this.daoService.getBounties({
            contractId: contractId,
            from_index: from_index,
            limit: limit,
        });
        return res;
    }
    async getLastBountyId({ contractId, }) {
        const res = await this.daoService.getLastBountyId({
            contractId: contractId,
        });
        return res;
    }
    async claimBounty({ contractId, id, deadline, deposit, }) {
        const res = await this.daoService.claimBounty({
            deposit: deposit,
            contractId: contractId,
            id: id,
            deadline: deadline,
        });
    }
    async giveUpBounty({ contractId, id, deposit, }) {
        const res = await this.daoService.giveUpBounty({
            deposit: deposit,
            contractId: contractId,
            id: id,
        });
    }
    async doneBounty({ contractId, id, deposit, }) {
        const res = await this.daoService.doneBounty({
            deposit: deposit,
            contractId: contractId,
            id: id,
        });
    }
    async getBalance({ accountId }) {
        const balance = await this.daoService.getBalance({ accountId: accountId });
        return balance;
    }
    getAccountID() {
        return this.nearWallet.getAccountID();
    }
    async getDAOConfig({ daoID, }) {
        const res = await this.daoService.getDAOConfig({ daoID: daoID });
        return res;
    }
}
exports.default = DaoManagerJS;
DaoManagerJS.instance = null;
//# sourceMappingURL=dao_manager_js_lib.js.map
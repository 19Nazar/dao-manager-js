import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  ActProposalModel,
  AddBountyModel,
  BlockChainResponse,
  ConnectionType,
  DaoManagerJS,
  NetworkID,
  ProposalTypes,
  Status,
} from "../package/index";

// Мокаем DaoManagerJS
jest.mock("../package/index", () => {
  const actual =
    jest.requireActual<typeof import("../package/index")>("../package/index");
  return {
    // ...jest.requireActual("../package/index"),
    ...actual,
    DaoManagerJS: {
      getInstance: jest.fn(() => ({
        createDaoManager: jest.fn(() => Promise.resolve(undefined)),
        createConnection: jest.fn(),
        logIn: jest.fn(),
        checkIsSign: jest.fn(),
        createAccessKey: jest.fn(),
        getResultTxns: jest.fn(),
        signOut: jest.fn(),
        getPolicy: jest.fn(),
        addProposal: jest.fn(),
        getProposalByID: jest.fn(),
        getMultipleProposals: jest.fn(),
        getLastProposalId: jest.fn(),
        actProposal: jest.fn(),
        getBounties: jest.fn(),
        getLastBountyId: jest.fn(),
        claimBounty: jest.fn(),
        giveUpBounty: jest.fn(),
        doneBounty: jest.fn(),
        getBalance: jest.fn(),
        getAccountID: jest.fn(),
        getDAOConfig: jest.fn(),
      })),
    },
  };
});

let daoManager: jest.Mocked<DaoManagerJS>;

beforeEach(() => {
  jest.clearAllMocks();
  daoManager = DaoManagerJS.getInstance() as jest.Mocked<DaoManagerJS>;
});

describe("DaoManager", () => {
  test("createDaoManager", async () => {
    const result = await daoManager.createDaoManager({
      deposit: "1",
      metadata: JSON.stringify({ iconImage: "Image base64 format" }),
      name: "test-dao.testnet",
      policy: ["example.testnet"],
      purpose: "Test purpose",
    });

    expect(result).toBeUndefined();
  });

  test("createConnection ", async () => {
    daoManager.createConnection.mockResolvedValue(true);
    console.log("ConnectionType:", ConnectionType.wallet);

    const result = await daoManager.createConnection({
      connectionType: ConnectionType.wallet,
      networkID: NetworkID.testnet,
    });

    expect(result).toBe(true);
  });

  test("logIn", async () => {
    daoManager.logIn.mockResolvedValue(undefined);
    const result = await daoManager.logIn({
      successUrl: "https://success.com",
      failureUrl: "https://fail.com",
    });

    expect(result).toBeUndefined();
  });

  test("checkIsSign", async () => {
    daoManager.checkIsSign.mockResolvedValue(true);

    const result = await daoManager.checkIsSign();

    expect(result).toBe(true);
  });

  test("createAccessKey", async () => {
    const res = await daoManager.createAccessKey({
      nameContract: "test-contract",
      successUrl: "https://success.com",
    });

    expect(daoManager.createAccessKey).toHaveBeenCalledWith({
      nameContract: "test-contract",
      successUrl: "https://success.com",
    });
  });

  test("getResultTxns", async () => {
    const resp = new BlockChainResponse({
      status: Status.successful,
      data: { resp: "test" },
    });
    daoManager.getResultTxns.mockResolvedValue(resp);

    const result = await daoManager.getResultTxns({
      txnHesh: "0x123",
    });

    expect(result).toEqual(resp);
  });

  test("signOut", () => {
    daoManager.signOut();

    expect(daoManager.signOut).toHaveBeenCalled();
  });

  test("getPolicy", async () => {
    const mockPolicy = new BlockChainResponse({
      status: Status.successful,
      data: { test: "test" },
    });
    daoManager.getPolicy.mockResolvedValue(mockPolicy);

    const result = await daoManager.getPolicy({ contractId: "test-contract" });

    expect(result).toEqual(mockPolicy);
  });

  test("addProposal", async () => {
    await daoManager.addProposal({
      contractId: "test-dao.testnet",
      description: "New proposal",
      gas: "1000000",
      deposit: "10",
      proposalTypes: ProposalTypes.AddBounty,
      addProposalModel: new AddBountyModel({
        description: "description",
        token: "token",
        amount: "2",
        times: 23,
        max_deadline: "11123432521",
      }),
    });

    expect(daoManager.addProposal).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      description: "New proposal",
      gas: "1000000",
      deposit: "10",
      proposalTypes: ProposalTypes.AddBounty,
      addProposalModel: new AddBountyModel({
        description: "description",
        token: "token",
        amount: "2",
        times: 23,
        max_deadline: "11123432521",
      }),
    });
  });

  test("getProposalByID", async () => {
    const mockProposal = new BlockChainResponse({
      status: Status.successful,
      data: { description: "Test Proposal" },
    });
    daoManager.getProposalByID.mockResolvedValue(mockProposal);

    const result = await daoManager.getProposalByID({
      contractId: "test-dao.testnet",
      id: 1,
    });

    expect(result).toEqual(mockProposal);
  });

  test("getMultipleProposals", async () => {
    const mockProposals = new BlockChainResponse({
      status: Status.successful,
      data: [{ id: 1 }, { id: 2 }],
    });
    daoManager.getMultipleProposals.mockResolvedValue(mockProposals);

    const result = await daoManager.getMultipleProposals({
      contractId: "test-dao.testnet",
      from_index: 0,
      limit: 10,
    });

    expect(result).toEqual(mockProposals);
  });

  test("getLastProposalId", async () => {
    const mockProposals = new BlockChainResponse({
      status: Status.successful,
      data: { data: 5 },
    });
    daoManager.getLastProposalId.mockResolvedValue(mockProposals);

    const result = await daoManager.getLastProposalId({
      contractId: "test-dao.testnet",
    });

    expect(result).toBe(mockProposals);
  });

  test("actProposal", async () => {
    await daoManager.actProposal({
      contractId: "test-dao.testnet",
      id: 1,
      action: ActProposalModel.VoteApprove,
    });

    expect(daoManager.actProposal).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 1,
      action: ActProposalModel.VoteApprove,
    });
  });

  test("getBounties", async () => {
    const mockBounties = new BlockChainResponse({
      status: Status.successful,
      data: [
        { id: 1, reward: "10" },
        { id: 2, reward: "20" },
      ],
    });
    daoManager.getBounties.mockResolvedValue(mockBounties);

    const result = await daoManager.getBounties({
      contractId: "test-dao.testnet",
      from_index: 0,
      limit: 10,
    });

    expect(result).toEqual(mockBounties);
  });

  test("getLastBountyId", async () => {
    const mockResponse = new BlockChainResponse({
      status: Status.successful,
      data: { lastBountyId: 42 },
    });
    daoManager.getLastBountyId.mockResolvedValue(mockResponse);

    const result = await daoManager.getLastBountyId({
      contractId: "test-dao.testnet",
    });

    expect(result).toEqual(mockResponse);
  });

  test("claimBounty", async () => {
    daoManager.claimBounty.mockResolvedValue(undefined);
    await daoManager.claimBounty({
      contractId: "test-dao.testnet",
      id: 1,
      deadline: "2025-12-31T23:59:59Z",
      deposit: "10",
    });

    expect(daoManager.claimBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 1,
      deadline: "2025-12-31T23:59:59Z",
      deposit: "10",
    });
  });

  test("giveUpBounty", async () => {
    daoManager.giveUpBounty.mockResolvedValue(undefined);
    await daoManager.giveUpBounty({
      contractId: "test-dao.testnet",
      id: 2,
      deposit: "5",
    });

    expect(daoManager.giveUpBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 2,
      deposit: "5",
    });
  });

  test("doneBounty", async () => {
    daoManager.doneBounty.mockResolvedValue(undefined);
    await daoManager.doneBounty({
      contractId: "test-dao.testnet",
      id: 3,
      deposit: "15",
    });

    expect(daoManager.doneBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 3,
      deposit: "15",
    });
  });
});

describe("DaoManager Account and Config", () => {
  test("getBalance", async () => {
    daoManager.getBalance.mockResolvedValue("100");
    const result = await daoManager.getBalance({ accountId: "user.testnet" });

    expect(result).toBe("100");
  });

  test("getAccountID", () => {
    daoManager.getAccountID.mockReturnValue("user.testnet");
    const result = daoManager.getAccountID();

    expect(result).toBe("user.testnet");
  });

  test("getDAOConfig", async () => {
    const mockResponse = new BlockChainResponse({
      status: Status.successful,
      data: { name: "Test DAO", policy: ["member1.testnet"] },
    });
    daoManager.getDAOConfig.mockResolvedValue(mockResponse);

    const result = await daoManager.getDAOConfig({ daoID: "test-dao.testnet" });

    expect(result).toEqual(mockResponse);
  });

  test("getLastBountyId", async () => {
    const mockResponse = new BlockChainResponse({
      status: Status.successful,
      data: { lastBountyId: 42 },
    });
    daoManager.getLastBountyId.mockResolvedValue(mockResponse);

    const result = await daoManager.getLastBountyId({
      contractId: "test-dao.testnet",
    });

    expect(result).toEqual(mockResponse);
  });

  test("claimBounty", async () => {
    daoManager.claimBounty.mockResolvedValue(undefined);
    await daoManager.claimBounty({
      contractId: "test-dao.testnet",
      id: 1,
      deadline: "2025-12-31T23:59:59Z",
      deposit: "10",
    });

    expect(daoManager.claimBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 1,
      deadline: "2025-12-31T23:59:59Z",
      deposit: "10",
    });
  });

  test("giveUpBounty", async () => {
    daoManager.giveUpBounty.mockResolvedValue(undefined);
    await daoManager.giveUpBounty({
      contractId: "test-dao.testnet",
      id: 2,
      deposit: "5",
    });

    expect(daoManager.giveUpBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 2,
      deposit: "5",
    });
  });

  test("doneBounty", async () => {
    daoManager.doneBounty.mockResolvedValue(undefined);
    await daoManager.doneBounty({
      contractId: "test-dao.testnet",
      id: 3,
      deposit: "15",
    });

    expect(daoManager.doneBounty).toHaveBeenCalledWith({
      contractId: "test-dao.testnet",
      id: 3,
      deposit: "15",
    });
  });


  test("getBalance", async () => {
    daoManager.getBalance.mockResolvedValue("100");
    const result = await daoManager.getBalance({ accountId: "user.testnet" });

    expect(result).toBe("100");
  });

  test("getAccountID", () => {
    daoManager.getAccountID.mockReturnValue("user.testnet");
    const result = daoManager.getAccountID();

    expect(result).toBe("user.testnet");
  });

  test("getDAOConfig", async () => {
    const mockResponse = new BlockChainResponse({
      status: Status.successful,
      data: { name: "Test DAO", policy: ["member1.testnet"] },
    });
    daoManager.getDAOConfig.mockResolvedValue(mockResponse);

    const result = await daoManager.getDAOConfig({ daoID: "test-dao.testnet" });

    expect(result).toEqual(mockResponse);
  });
});

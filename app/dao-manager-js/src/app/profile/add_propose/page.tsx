"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import {
  BlockChainResponse,
  ProposalTypes,
  Status,
} from "../../../../../../package/models/near_models";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import AddBounty from "./components/add_bounty";
import { ConstantsDashboard } from "../../../const/const";
import AddRemoveMemberToRole from "./components/add_member_to_role";
import Transfer from "./components/transfer";
import ChangeConfig from "./components/change_config";
import BountyDone from "./components/bounty_done";
import { ServiceDAO } from "../../../service/service";
import styles from "../../style/profile.module.css";
import { Utils } from "../../../../../../package/utils/utils";
import ModelBounty from "./components/modal_for_bounty";
import ResponseModal from "../../../shared_widgets/respone_modal";
import useTransactionStatus from "../../../service/useTransactionStatus";

export default function AddProposeDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectLable, setSelectLable] = useState<string | null>(null);
  const [startId, setStartId] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);
  const [outputBounty, setOutputBounty] = useState<Array<JSX.Element> | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<object>();
  const [pageNumb, setPageNumb] = useState<number>(1);

  ServiceDAO.checkAuth(router);

  useTransactionStatus(setResSuccessData, setResFailureData);

  useEffect(() => {
    if (daoID) {
      async function get() {
        const lastId = (
          await daoManagerJS.getLastBountyId({ contractId: daoID })
        ).data;
        setPageNumb(Math.floor(Number(lastId) / 6) + 1);
        await getBountyPagination({});
      }
      get();
    }
  }, [daoID]);

  async function getBountyPagination({
    newDaoid,
    newStartId,
    newLimit,
  }: {
    newDaoid?: string;
    newStartId?: number;
    newLimit?: number;
  }) {
    if (daoID == null && newDaoid == null) {
      throw new Error("You must input DAO id");
    }
    const res = (await getSixBounty({
      contractId: newDaoid ?? daoID,
      startIdexId: newStartId ?? startId,
      limit: newLimit ?? limit,
    })) as Array<object>;
    const arrayWidgets = res.map((object) => {
      object["amount"] = Utils.yoctoNEARToNear(object["amount"]);
      return (
        <Card
          shadow="sm"
          isPressable
          key={object["id"]}
          style={{ margin: 10 }}
          onPress={() => {
            setSelectedModel(object);
          }}
        >
          <CardHeader>{object["description"]}</CardHeader>
          <CardBody>
            <div>
              <h1>Amount: {object["amount"]} Near</h1>
            </div>
          </CardBody>
        </Card>
      );
    });
    setOutputBounty(arrayWidgets);
  }

  async function actionPagination(page: number) {
    const newLimit = page * 6;
    const newStartId = newLimit - 6;
    setLimit(newLimit);
    setStartId(newStartId);
    await getBountyPagination({
      newStartId: newStartId,
      newLimit: newLimit,
    });
  }

  async function getSixBounty({
    contractId,
    startIdexId,
    limit,
  }: {
    contractId: string;
    startIdexId: number;
    limit: number;
  }): Promise<object> {
    const res = await daoManagerJS.getBounties({
      contractId: contractId,
      from_index: startIdexId,
      limit: limit,
    });
    if (res.status == Status.successful) {
      return res.data;
    } else {
      throw new Error(`Incorrect response: ${res.data}`);
    }
  }

  const proposalsWidgets: Record<string, JSX.Element> = {
    [ProposalTypes.AddBounty]: <AddBounty daoID={daoID || ""} />,
    [ProposalTypes.AddMemberToRole]: (
      <AddRemoveMemberToRole daoID={daoID || ""} />
    ),
    [ProposalTypes.Transfer]: <Transfer daoID={daoID || ""} />,
    [ProposalTypes.ChangeConfig]: <ChangeConfig daoID={daoID || ""} />,
    [ProposalTypes.BountyDone]: <BountyDone daoID={daoID || ""} />,
  };

  if (resFailureData || resSuccessData) {
    return (
      <div style={{ display: "flex" }}>
        <ResponseModal
          resFailureData={resFailureData}
          resSuccessData={resSuccessData}
          setResFailureData={setResFailureData}
          setResSuccessData={setResSuccessData}
        />
      </div>
    );
  }

  if (selectedModel) {
    return (
      <ModelBounty
        daoID={daoID}
        data={selectedModel}
        onOpenChange={() => setSelectedModel(null)}
        isOpen={true}
      />
    );
  }

  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <h4 className="font-bold text-large">Add proposal</h4>
            <div>
              {!daoID ? (
                <h1>For Interaction you must add DAO smart contract id</h1>
              ) : (
                <div>
                  <h4>
                    To make a proposal you need choose type propose and enter
                    the following parameters:
                  </h4>
                  <div
                    style={{
                      marginTop: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          style={{ backgroundColor: "#4FD1D9" }}
                          variant="bordered"
                        >
                          {selectLable ? selectLable : "Choose propose"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Action event example"
                        onAction={(key) => setSelectedProposal(key as string)}
                      >
                        <DropdownItem
                          key={ProposalTypes.AddBounty}
                          onClick={() => {
                            setSelectLable("Add bounty");
                          }}
                        >
                          Add bounty
                        </DropdownItem>
                        <DropdownItem
                          key={ProposalTypes.AddMemberToRole}
                          onClick={() => {
                            setSelectLable("Add | Remove member to role");
                          }}
                        >
                          Add | Remove member to role
                        </DropdownItem>
                        <DropdownItem
                          key={ProposalTypes.Transfer}
                          onClick={() => {
                            setSelectLable("Transfer");
                          }}
                        >
                          Transfer
                        </DropdownItem>
                        <DropdownItem
                          key={ProposalTypes.ChangeConfig}
                          onClick={() => {
                            setSelectLable("Change Config");
                          }}
                        >
                          Change Config
                        </DropdownItem>
                        <DropdownItem
                          key={ProposalTypes.BountyDone}
                          onClick={() => {
                            setSelectLable("Bounty Done");
                          }}
                        >
                          Bounty Done
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div>{proposalsWidgets[selectedProposal]}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {!daoID ? (
                      <h1 style={{ margin: 20 }}>
                        To see the bounty you have to enter the DAO id
                      </h1>
                    ) : !outputBounty ? (
                      <CircularProgress label="Loading..." />
                    ) : outputBounty.length == 0 ? (
                      <h1 style={{ margin: 20 }}>You don`t have bounty</h1>
                    ) : (
                      <div
                        style={{
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        <div className={styles.cardGrid}>
                          {outputBounty.map((proposal) => {
                            return proposal;
                          })}
                        </div>
                        <div
                          style={{
                            marginTop: 15,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Pagination
                            showControls
                            total={pageNumb}
                            initialPage={1}
                            onChange={(page) => {
                              async function updateDATA(page: number) {
                                if (page <= -1) {
                                  await actionPagination(page * -1);
                                } else {
                                  await actionPagination(page);
                                }
                              }
                              updateDATA(page);
                            }}
                            color="success"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

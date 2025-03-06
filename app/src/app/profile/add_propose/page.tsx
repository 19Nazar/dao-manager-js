"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
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
import ModelBounty from "./components/modal_for_bounty";
import ResponseModal from "../../../shared_widgets/respone_modal";
import useTransactionStatus from "../../../service/useTransactionStatus";
import { DaoManagerJS, ProposalTypes, Status, Utils } from "dao-manager-js";
import LoadingSpinner from "../component/LoadingSpinner";
import { motion } from "framer-motion";

export default function AddProposeDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();
  const [daoID, setDaoId] = useState<string | null>(null);

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectLable, setSelectLable] = useState<string | null>(null);
  const [startId, setStartId] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);
  const [outputBounty, setOutputBounty] = useState<Array<JSX.Element> | null>(
    null,
  );
  const [connection, setConnection] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<object>();
  const [pageNumb, setPageNumb] = useState<number>(1);

  useEffect(() => {
    async function init() {
      const connection = await ServiceDAO.checkAuth(router);
      setConnection(connection);
      useTransactionStatus(setResSuccessData, setResFailureData, searchParams);
      const daoID = localStorage.getItem(ConstantsDashboard.daoId);
      if (daoID) {
        setDaoId(daoID);
      }
    }
    if (router) {
      const handle = setTimeout(() => {
        init();
      }, 0);

      return () => clearTimeout(handle);
    }
  }, [router]);

  useEffect(() => {
    async function get() {
      const lastId = (await daoManagerJS.getLastBountyId({ contractId: daoID }))
        .data;
      setPageNumb(Math.floor(Number(lastId) / 6) + 1);
      await getBountyPagination({});
    }
    if (daoID && connection) {
      get();
    }
  }, [daoID, connection]);

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
          shadow="md"
          isPressable
          key={object["id"]}
          style={{
            margin: 10,
            width: 300,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#4b4f53",
          }}
          onPress={() => {
            setSelectedModel(object);
          }}
        >
          <CardHeader>
            <h1
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {object["description"]}
            </h1>
          </CardHeader>
          <CardBody>
            <h1>Amount: {object["amount"]} Near</h1>
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

  if (connection == null) {
    return <LoadingSpinner />;
  }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: 100, height: "auto" }}
    >
      <div
        className="main_profile"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!daoID ? (
          <div>
            <Card>
              <CardBody>
                <h4 className="font-bold text-large">Add proposal</h4>
                <h1>For Interaction you must add DAO smart contract id</h1>
              </CardBody>
            </Card>
          </div>
        ) : (
          <div>
            <Card>
              <CardBody>
                <h4 className="font-bold text-large">Add proposal</h4>
                <h4>
                  To make a proposal you need choose type propose and enter the
                  following parameters:
                </h4>
              </CardBody>
            </Card>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    style={{ backgroundColor: "#262626" }}
                    variant="bordered"
                  >
                    <h1 style={{ color: "white" }}>
                      {selectLable ? selectLable : "Choose propose"}
                    </h1>
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
            <div style={{ marginTop: 20 }}>
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-large">
                    This is list of all bounty
                  </h3>
                </CardHeader>
                <CardBody>
                  <div>
                    {!daoID ? (
                      <h1 style={{ margin: 20 }}>
                        To see the bounty you have to enter the DAO id
                      </h1>
                    ) : !outputBounty ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress />
                      </div>
                    ) : outputBounty.length == 0 ? (
                      <div style={{ margin: 20 }}>
                        <h1>You don`t have bounty</h1>
                        <h1>
                          To interact with bounty you need to first make a
                          proposal to create bounty, then validate it.
                        </h1>
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <div
                            className={styles.cardGrid}
                            style={{ justifyContent: "center" }}
                          >
                            {outputBounty.map((proposal) => {
                              return proposal;
                            })}
                          </div>
                          <div
                            style={{
                              marginTop: 15,
                              display: "flex",
                              justifyContent: "flex-end",
                              width: "100%",
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
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";
import { useEffect, useState } from "react";
// import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Input,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import styles from "../style/profile.module.css";
import { ConstantsDashboard } from "../../const/const";
import ModelPropose from "./component/modal_for_proposal";
import { ServiceDAO } from "../../service/service";
import useTransactionStatus from "../../service/useTransactionStatus";
import ResponseModal from "../../shared_widgets/respone_modal";
import ProfileDAOCard from "./component/profile_dao_card";
import { DaoManagerJS, Status } from "dao-manager-js";
import LoadingSpinner from "./component/LoadingSpinner";
import { ButtonTab } from "src/shared_widgets/ButtonTab/ButtonTab";
import { motion } from "framer-motion";

export default function Profile() {
  const router = useRouter();
  const daoManagerJS = DaoManagerJS.getInstance();
  const searchParams = useSearchParams();

  const [accountID, setAccountID] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<object>();
  const [daoId, setDaoId] = useState<string | null>(null);
  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);
  const [outputProposals, setOutputProposals] =
    useState<Array<JSX.Element> | null>(null);
  const [startId, setStartId] = useState<number>(0);
  const [pageNumb, setPageNumb] = useState<number>(1);
  const limit = 6;
  const [connection, setConnection] = useState<boolean | null>(null);

  const [activeSearch, setActiveSearch] = useState<"proposal" | "bounty">(
    "proposal",
  );

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
      const lastId = (
        await daoManagerJS.getLastProposalId({ contractId: daoId })
      ).data;
      setPageNumb(Math.floor(Number(lastId) / 6) + 1);
      await getProposalsPagination({});
    }
    if (daoId && connection) {
      get();
    }
  }, [daoId, connection]);

  async function getProposalsPagination({
    newDaoid,
    newStartId,
  }: {
    newDaoid?: string;
    newStartId?: number;
  }) {
    if (daoId == null && newDaoid == null) {
      throw new Error("You must input DAO id");
    }
    const res = (await getSixProposals({
      contractId: newDaoid ?? daoId,
      startIdexId: newStartId ?? startId,
    })) as Array<object>;
    const arrayWidgets = res.map((object) => {
      return (
        <Card
          shadow="md"
          isPressable
          key={`${startId}-${object["id"]}`}
          style={{
            maxWidth: "500px",
            width: "100%",
            minWidth: "50px",
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
            <h1
              style={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {object["proposer"]}
            </h1>
            <h1>{object["status"]}</h1>
            <h1>{Object.keys(object["kind"])[0]}</h1>
          </CardBody>
        </Card>
      );
    });
    setOutputProposals(arrayWidgets);
  }

  async function actionPagination(page: number) {
    const newStartId = page * 6 - limit;
    setStartId(newStartId);
    await getProposalsPagination({
      newStartId: newStartId,
    });
  }

  async function getSixProposals({
    contractId,
    startIdexId,
  }: {
    contractId: string;
    startIdexId: number;
  }): Promise<object> {
    const res = await daoManagerJS.getMultipleProposals({
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

  async function addDaoID(accountId: string) {
    const correctID = accountId.trim();
    localStorage.setItem(ConstantsDashboard.daoId, correctID);
    setDaoId(correctID);
    // await getProposalsPagination({ newDaoid: correctID });
  }

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
      <ModelPropose
        daoID={daoId}
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
    >
      <div
        className="main_profile"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: `${ConstantsDashboard.maxWidth}px`,
          width: "100%",
          gap: "20px",
        }}
      >
        <div
          className={styles.profile_dao}
          style={{ display: "flex", flex: 1, gap: "20px" }}
        >
          <div style={{ display: "flex", flex: 1, minHeight: "274px" }}>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">DAO initialization</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h1>
                  If you have not created a DAO yet, go to create DAO section
                </h1>
                <h1>
                  Input DAO contract id for interact with in (you must have
                  appropriate privileges)
                </h1>
                <Input
                  className="mt-5"
                  autoFocus
                  label="Account id DAO"
                  placeholder="Enter account id for DAO"
                  variant="bordered"
                  value={accountID}
                  onChange={(e) => setAccountID(e.target.value)}
                />
                <CustomButton
                  style={{ marginTop: 10 }}
                  text={"Add DAO id"}
                  onClick={async () => {
                    await addDaoID(accountID);
                  }}
                />
              </CardBody>
            </Card>
          </div>
          {daoId == null ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                height: "100%",
                width: "100%",
                minHeight: "274px",
              }}
            >
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-large">DAO profile</h3>
                </CardHeader>
                <CardBody>
                  <h1 style={{ margin: 20 }}>
                    To see the profile DAO you have to enter the DAO id
                  </h1>
                </CardBody>
              </Card>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                width: "100%",
              }}
            >
              <ProfileDAOCard daoID={daoId} />
            </div>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex" }}>
                  <ButtonTab
                    isActive={activeSearch == "proposal"}
                    onClick={() => setActiveSearch("proposal")}
                    style={{ width: "100%" }}
                  >
                    Proposal
                  </ButtonTab>
                  <ButtonTab
                    isActive={activeSearch == "bounty"}
                    onClick={() => setActiveSearch("bounty")}
                    style={{ width: "100%" }}
                  >
                    Bounty
                  </ButtonTab>
                </div>
                <h3 className="font-bold text-large">
                  This is list search value
                </h3>
              </div>
            </CardHeader>
            {activeSearch == "proposal" && (
              <CardBody>
                <div>
                  {!daoId ? (
                    <h1 style={{ margin: 20 }}>
                      To see the proposals you have to enter the DAO id
                    </h1>
                  ) : !outputProposals ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Spinner
                        label="Load data"
                        color="current"
                        style={{ color: "black" }}
                      />
                    </div>
                  ) : outputProposals.length == 0 ? (
                    <div style={{ margin: 20 }}>
                      <h1>You don`t have proposals.</h1>
                      <h1>
                        In order to make the first proposal, you need to go to
                        the Add Proposal tab and select the appropriate
                        proposal.
                      </h1>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                        width: "100%",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className={styles.cardGrid}
                        key={startId}
                      >
                        {outputProposals.map((proposal, startId) => {
                          return proposal;
                        })}
                      </motion.div>
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
              </CardBody>
            )}

            {activeSearch == "bounty" && <CardBody>"test"</CardBody>}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

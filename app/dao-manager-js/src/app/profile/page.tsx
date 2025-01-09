"use client";
import { useEffect, useState } from "react";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter, useSearchParams } from "next/navigation";
import { Status } from "../../../../../package/models/near_models";
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
import NavbarComponent from "../../shared_widgets/navbar";
import { ConstantsDashboard } from "../../const/const";
import ModelPropose from "./component/modal_for_proposal";
import { ServiceDAO } from "../../service/service";
import useTransactionStatus from "../../service/useTransactionStatus";
import ResponseModal from "../../shared_widgets/respone_modal";

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
    init();
  }, []);

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
    console.log(res);
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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Spinner size="lg" color="white">
          Load page
        </Spinner>
      </div>
    );
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
    <div style={{ minHeight: 100, height: "auto" }}>
      <NavbarComponent />
      <div
        className="main_profile"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 500 }}>
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
        <div style={{ marginTop: 20 }}>
          <Card>
            <CardHeader>
              <h3 className="font-bold text-large">
                This is list of all proposals
              </h3>
            </CardHeader>
            <CardBody>
              <div>
                {!daoId ? (
                  <h1 style={{ margin: 20 }}>
                    To see the proposals you have to enter the DAO id
                  </h1>
                ) : !outputProposals ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress label="Loading..." />
                  </div>
                ) : outputProposals.length == 0 ? (
                  <h1 style={{ margin: 20 }}>You don`t have proposals</h1>
                ) : (
                  <div
                    style={{
                      height: "auto",
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                    }}
                  >
                    <div className={styles.cardGrid} key={startId}>
                      {outputProposals.map((proposal, startId) => {
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
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

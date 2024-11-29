"use client";
import { useEffect, useState } from "react";
import DaoManagerJS from "../../../../../package/dao_manager_js_lib";
import CustomButton from "../../shared_widgets/custom_button";
import { useRouter } from "next/navigation";
import {
  ConnectionType,
  NetworkID,
  Status,
} from "../../../../../package/models/near_models";
import { UrlDashboard } from "../../url_dashboard/url_dashboard";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Pagination,
} from "@nextui-org/react";
import styles from "../style/profile.module.css";
import NavbarComponent from "../../shared_widgets/navbar";
import { ConstantsDashboard } from "../../const/const";

export default function Profile() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const [accountID, setAccountID] = useState<string>("");
  const [daoId, setDaoId] = useState<string | null>(
    localStorage.getItem(ConstantsDashboard.daoId),
  );
  const [outputProposals, setOutputProposals] =
    useState<Array<JSX.Element> | null>(null);
  let startId = 0;
  let limit = 6;
  let pageNumb = 1;

  if (!typeConnection) {
    router.push(UrlDashboard.login);
  } else if (typeConnection == "wallet") {
    daoManagerJS.createConnection({
      connectionType: ConnectionType.wallet,
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
    });
  } else if (typeConnection == "default") {
    if (!dataDefault) {
      throw new Error("You need login correctly");
    }
    const data = JSON.parse(dataDefault);
    daoManagerJS.createConnection({
      networkID: network == "mainnet" ? NetworkID.mainnet : NetworkID.testnet,
      connectionType: ConnectionType.default,
      accountID: data.accountId,
      privateKey: data.key,
    });
  } else {
    throw new Error("You need log in correctly");
  }

  useEffect(() => {
    if (daoId) {
      async function get() {
        const lastId = (
          await daoManagerJS.getLastProposalId({ contractId: daoId })
        ).data;
        pageNumb = Math.floor(Number(lastId) / 6) + 1;
        await getProposalsPagination();
      }
      get();
    }
  }, [daoId]);

  async function getProposalsPagination() {
    if (daoId == null) {
      throw new Error("You must input DAO id");
    }
    const res = (await getSixProposals({
      contractId: daoId,
      startIdexId: startId,
      limit: limit,
    })) as Array<object>;
    const arrayWidgets = res.map((object) => {
      return (
        <Card key={object["id"]} style={{ margin: 10 }}>
          <CardHeader>{object["description"]}</CardHeader>
          <CardBody>
            <h1>{object["proposer"]}</h1>
            <h1>{Object.keys(object["kind"])[0]}</h1>
          </CardBody>
        </Card>
      );
    });
    setOutputProposals(arrayWidgets);
    const element = document.querySelector("body");
    element.offsetHeight;
  }

  async function actionPagination(page: number) {
    limit = page * 2;
    startId = limit - 6;
    await getProposalsPagination();
  }

  async function getSixProposals({
    contractId,
    startIdexId,
    limit,
  }: {
    contractId: string;
    startIdexId: number;
    limit: number;
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

  function addDaoID(accountId: string) {
    localStorage.setItem(ConstantsDashboard.daoId, accountId);
    setDaoId(accountId);
  }

  async function test() {
    const test = await daoManagerJS.getBounties({ contractId: daoId });
    console.log(test);
  }
  return (
    <div style={{ minHeight: 100, height: "auto" }}>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">DAO init</h4>
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
                  onClick={() => {
                    addDaoID(accountID);
                  }}
                />
                <CustomButton
                  style={{ marginTop: 10 }}
                  text={"set"}
                  onClick={async () => {
                    await getSixProposals({
                      contractId: daoId,
                      startIdexId: 0,
                      limit: 6,
                    });
                  }}
                />
              </CardBody>
            </Card>
            {!outputProposals ? (
              <h1>You don`t have any proposals or data not load</h1>
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
                  {outputProposals.map((proposal) => {
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
                    onChange={async (page) => {
                      await actionPagination(page);
                    }}
                    color="success"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

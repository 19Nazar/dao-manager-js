"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import {
  BlockChainResponse,
  Status,
} from "../../../../../../package/models/near_models";
import CustomButton from "../../../shared_widgets/custom_button";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ServiceDAO } from "../../../service/service";

export default function CreateDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();

  const [nameDAO, setNameDAO] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [policy, setPolicy] = useState<string>("");
  const [metadata, setMetadata] = useState<string>("");
  const [resData, setResData] = useState<BlockChainResponse | null>(null);

  ServiceDAO.checkAuth(router);

  useEffect(() => {
    async function getHesh({ txnHesh, accountId }) {
      const resp = await daoManagerJS.getResultTxns({
        txnHesh: txnHesh,
        accountId: accountId,
      });
      setResData(resp);
    }
    const accountID = daoManagerJS.getAccountID();
    setPolicy(accountID);
    const hesh = searchParams.get("transactionHashes");
    if (hesh) {
      getHesh({ txnHesh: hesh, accountId: accountID });
    }
  }, []);

  // async function createAccessKey() {
  //   const key = await daoManagerJS.createAccessKey({
  //     nameContract: "daotest.sputnik-v2.testnet",
  //     successUrl: UrlDashboard.url + UrlDashboard.create_dao,
  //   });
  // }

  async function createDAO({
    name,
    purpose,
    metadata,
    policy,
  }: {
    name: string;
    purpose: string;
    metadata?: string;
    policy?: string;
  }) {
    const convertPolicy = policy?.split(",").map((x) => x.trim());
    const test = await daoManagerJS.createDaoMeneger({
      name: name.toLocaleLowerCase(),
      purpose: purpose,
      metadata: metadata,
      policy: convertPolicy,
    });
  }
  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Creating DAO</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h4>
                  To create a DAO you need to enter the following parameters:
                </h4>
                <Input
                  className="mt-4"
                  autoFocus
                  label="Name for DAO"
                  placeholder="Enter name for DAO"
                  variant="bordered"
                  value={nameDAO}
                  onChange={(e) => setNameDAO(e.target.value)}
                />
                <Input
                  className="mt-5"
                  autoFocus
                  label="Purpose for DAO"
                  placeholder="Enter purpose for DAO"
                  variant="bordered"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                <Input
                  className="mt-5"
                  autoFocus
                  label="Policy for DAO(write whit comma ',')"
                  placeholder="Enter policy for DAO"
                  variant="bordered"
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                />
                <Input
                  className="mt-5"
                  autoFocus
                  label="Metadata for DAO"
                  placeholder="Enter metadata for DAO"
                  variant="bordered"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                />
                <CustomButton
                  style={{ marginTop: 5 }}
                  text={"Create DAO"}
                  onClick={async () => {
                    await createDAO({
                      name: nameDAO,
                      purpose: purpose,
                      metadata: metadata,
                      policy: policy,
                    });
                  }}
                />
              </CardBody>
            </Card>
          </div>
          <div>
            {resData ? (
              <h1
                className={
                  resData.status === Status.successful ? "" : "text-red"
                }
              >
                {atob(resData.data?.toString()) || "Absent data"}
              </h1>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

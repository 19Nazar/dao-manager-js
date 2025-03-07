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
          </div>
        )}
      </div>
    </motion.div>
  );
}

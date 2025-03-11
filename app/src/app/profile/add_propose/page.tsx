"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import AddBounty from "./components/add_bounty";
import { ConstantsDashboard } from "../../../const/const";
import AddRemoveMemberToRole from "./components/add_member_to_role";
import Transfer from "./components/transfer";
import ChangeConfig from "./components/change_config";
import BountyDone from "./components/bounty_done";
import { ServiceDAO } from "../../../service/service";
import ModelBounty from "./components/modal_for_bounty";
import ResponseModal from "../../../shared_widgets/respone_modal";
import { ProposalTypes } from "dao-manager-js";
import LoadingSpinner from "../component/LoadingSpinner";
import { motion } from "framer-motion";
import { useTransactionStatus } from "src/service/useTransactionStatus";

export default function AddProposeDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [daoID, setDaoId] = useState<string | null>(null);

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectLable, setSelectLable] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState<object>();

  useEffect(() => {
    async function init() {
      const connection = await ServiceDAO.checkAuth(router);
      setConnection(connection);
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

  useTransactionStatus(setResSuccessData, setResFailureData, connection);

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

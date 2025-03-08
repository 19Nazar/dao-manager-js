"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { ConstantsDashboard } from "../../../const/const";
import CustomButton from "../../../shared_widgets/custom_button";
import ChangePolicy from "./components/change_policy";
import { ServiceDAO } from "../../../service/service";
import useTransactionStatus from "../../../service/useTransactionStatus";
import ResponseModal from "../../../shared_widgets/respone_modal";
import { DaoManagerJS, Utils } from "dao-manager-js";
import LoadingSpinner from "../component/LoadingSpinner";
import { motion } from "framer-motion";

export default function SettingsDao() {
  const router = useRouter();
  const daoManagerJS = DaoManagerJS.getInstance();
  const searchParams = useSearchParams();

  const [daoID, setDaoId] = useState<string | null>(null);

  const { onOpen, onOpenChange } = useDisclosure();
  const [isChangePolicyOpen, setIsChangePolicyOpen] = useState(false);

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);

  const [settings, setSettings] = useState<object | null>(null);
  const [proposalBond, setProposalBond] = useState<string | null>(null);
  const [bountyBond, setBountyBond] = useState<string | null>(null);

  const [connection, setConnection] = useState<boolean>(false);

  const formattedSettings = useMemo(() => {
    if (!settings) return null;

    return {
      ...settings,
      proposal_bond: Utils.yoctoNEARToNear(settings["proposal_bond"]) + " Near",
      bounty_bond: Utils.yoctoNEARToNear(settings["bounty_bond"]) + " Near",
      proposal_period: getData(settings["proposal_period"]),
      bounty_forgiveness_period: getData(settings["bounty_forgiveness_period"]),
    };
  }, [settings]);

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
    }
  }, [router]);

  function RenderObject({ data, depth = 0 }) {
    const indent = { marginLeft: `${depth + 20}px` };
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key} style={indent}>
              <strong>{key}:</strong>
              {typeof value === "object" ? (
                <RenderObject data={value} depth={depth + 1} />
              ) : (
                value.toString()
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <div>{data}</div>;
  }

  useEffect(() => {
    async function getSettings(contractId: string) {
      const settingsData = await daoManagerJS.getPolicy({ contractId });
      setSettings(settingsData.data);
    }
    if (daoID && connection) {
      getSettings(daoID);
    }
  }, [daoID, connection]);

  function getData(dataNanosecund: string): string {
    let seconds = Number(dataNanosecund) / 1e9;
    let minutes;
    let hours;
    let days;
    if (seconds > 86400) {
      days = Math.floor(seconds / 86400);
      seconds = seconds % 86400;
    }
    if (seconds > 3600) {
      hours = Math.floor(seconds / 3600);
      seconds = seconds % 3600;
    }
    if (minutes > 60) {
      minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    return `${days ? "Days: " + days : ""} ${hours ? "Hours: " + hours : ""} ${minutes ? "Minutes: " + minutes : ""} ${seconds ? "Seconds: " + seconds : ""}`;
  }

  if (connection != true) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="main_profile"
      style={{
        maxWidth: `${ConstantsDashboard.maxWidth}px`,
        width: "100%",
        height: "100%",
      }}
    >
      <div className="flex flex-col gap-1 items-center justify-center ">
        <div>
          <Card className="max-w-full shadow-lg">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-large">DAO setting</h4>
            </CardHeader>
            <Divider className="my-4" />
            <CardBody className="overflow-visible py-2 gap-4">
              {daoID == null ? (
                <h1 style={{ marginBottom: 10 }}>
                  For Interaction you must add DAO smart contract id
                </h1>
              ) : formattedSettings ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "auto" }}
                >
                  <RenderObject data={formattedSettings} />
                </motion.div>
              ) : (
                <Spinner
                  label="Load data"
                  color="current"
                  style={{ color: "black" }}
                />
              )}

              {daoID && (
                <div
                  style={{
                    display: "flex",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    text="Change settings"
                    onClick={() => setIsChangePolicyOpen(true)}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      <ChangePolicy
        daoID={daoID}
        onOpenChange={() => setIsChangePolicyOpen(false)}
        isOpen={isChangePolicyOpen}
        proposalCost={proposalBond}
      />
    </motion.div>
  );
}

"use client";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ResponseModal from "../../../shared_widgets/respone_modal";
import { DaoManagerJS } from "dao-manager-js";
import { motion } from "framer-motion";

interface ProfileDAOCardProps {
  daoID: string;
}

const ProfileDAOCard: React.FC<ProfileDAOCardProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [daoProfileData, setDaoProfileData] = useState<object | null>(null);
  const [iconData, setIconData] = useState<string | null>(null);
  const [numberOfProposals, setNumberOfProposals] = useState<string | null>(
    null,
  );
  const [numberOfBounty, setNumberOfBounty] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);

  async function getDaoProfileData() {
    try {
      const daoProfileData = await daoManagerJS.getDAOConfig({ daoID });
      const metadata = atob(daoProfileData["data"]["metadata"]);
      const metadataDecode = JSON.parse(metadata);
      const numberOfProposals = await daoManagerJS.getLastProposalId({
        contractId: daoID,
      });
      const numberOfBounty = await daoManagerJS.getLastBountyId({
        contractId: daoID,
      });
      setIconData(metadataDecode["iconImage"]);
      setDaoProfileData(daoProfileData["data"]);
      setNumberOfProposals(numberOfProposals.data.toString());
      setNumberOfBounty(numberOfBounty.data.toString());
    } catch (error) {
      setResFailureData(error.message);
    }
  }

  useEffect(() => {
    getDaoProfileData();
  }, [daoID]);

  if (resFailureData) {
    return (
      <div style={{ display: "flex" }}>
        <ResponseModal
          resFailureData={resFailureData}
          resSuccessData={null}
          setResFailureData={setResFailureData}
          setResSuccessData={() => {}}
        />
      </div>
    );
  }

  return daoProfileData == null ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%", minHeight: "272px", display: "flex", flex: 1 }}
    >
      <Card
        style={{ height: "100%", minHeight: "272px", display: "flex", flex: 1 }}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">DAO profile</h4>
        </CardHeader>
        <CardBody>
          <div>
            <Skeleton className="flex rounded-full w-32 h-32" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%", minHeight: "272px", display: "flex", flex: 1 }}
    >
      <Card
        style={{ height: "100%", minHeight: "272px", display: "flex", flex: 1 }}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">DAO profile</h4>
        </CardHeader>
        <CardBody>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Avatar size="lg" src={iconData} />
            <h1
              style={{
                marginLeft: "10px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {daoProfileData["name"]}
            </h1>
          </div>
          <h1
            style={{
              marginTop: "10px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            Proposal: {daoProfileData["purpose"]}
          </h1>
          <h1
            style={{
              marginTop: "10px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            Number of proposals: {numberOfProposals}
          </h1>
          <h1
            style={{
              marginTop: "10px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            Number of bounty: {numberOfBounty}
          </h1>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default ProfileDAOCard;

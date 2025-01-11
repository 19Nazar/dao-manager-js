"use client";
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";

interface ProfileDAOCardProps {
  daoID: string;
}

const ProfileDAOCard: React.FC<ProfileDAOCardProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [daoProfileData, setDaoProfileData] = useState<object | null>(null);

  async function getDaoProfileData() {
    const daoProfileData = await daoManagerJS.getDAOConfig({ daoID });
    console.log(daoProfileData);
    setDaoProfileData(daoProfileData);
  }

  useEffect(() => {
    getDaoProfileData();
  }, [daoID]);

  return daoProfileData == null ? (
    <Card>
      <CardHeader className="font-bold text-large">DAO profile</CardHeader>
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
  ) : (
    <Card>
      <CardHeader className="font-bold text-large">DAO profile</CardHeader>
      <CardBody>
        <h1>Proposal: {daoProfileData["data"]["purpose"]}</h1>
      </CardBody>
    </Card>
  );
};

export default ProfileDAOCard;

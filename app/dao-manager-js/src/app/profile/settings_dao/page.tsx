"use client";
import { useRouter } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ConstantsDashboard } from "../../../const/const";
import CustomButton from "../../../shared_widgets/custom_button";
import ChangePolicy from "./components/change_policy";
import { ServiceDAO } from "../../../service/service";
import { Utils } from "../../../../../../package/utils/utils";

export default function SettingsDao() {
  const router = useRouter();
  const daoManagerJS = DaoManagerJS.getInstance();
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);

  const { onOpen, onOpenChange } = useDisclosure();
  const [isChangePolicyOpen, setIsChangePolicyOpen] = useState(false);

  const [settings, setSettings] = useState<object | null>(null);
  const [proposalBond, setProposalBond] = useState<string | null>(null);
  const [bountyBond, setBountyBond] = useState<string | null>(null);

  ServiceDAO.checkAuth(router);

  function RenderObject({ data, depth = 0 }) {
    const indent = { marginLeft: `${depth * 20}px` };
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
      const settings = await daoManagerJS.getPolicy({ contractId: contractId });
      setProposalBond(settings.data["proposal_bond"]);
      setBountyBond(settings.data["bounty_bond"]);
      const proposal_period = getData(settings.data["proposal_period"]);
      const bounty_forgiveness_period = getData(
        settings.data["bounty_forgiveness_period"],
      );
      const proposal_bond =
        Utils.yoctoNEARToNear(settings.data["proposal_bond"]) + " Near";
      const bounty_bond =
        Utils.yoctoNEARToNear(settings.data["bounty_bond"]) + " Near";

      const newSettings = {
        ...settings.data,
        bounty_bond: bounty_bond,
        proposal_bond: proposal_bond,
        proposal_period: proposal_period,
        bounty_forgiveness_period: bounty_forgiveness_period,
      };

      console.log(settings);
      setSettings(newSettings);
    }
    if (daoID) {
      getSettings(daoID);
    }
  }, []);

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

  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">DAO setting</h4>
              </CardHeader>
              <Divider className="my-4" />
              <CardBody className="overflow-visible py-2">
                {!daoID ? (
                  <h1>For Interaction you must add DAO smart contract id</h1>
                ) : settings ? (
                  <RenderObject data={settings} />
                ) : (
                  <Spinner>Load data</Spinner>
                )}

                <div
                  style={{
                    display: "flex",
                    marginTop: 10,
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <CustomButton
                    text="Change Policy"
                    onClick={() => setIsChangePolicyOpen(true)}
                  />
                </div>
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
      </div>
    </div>
  );
}

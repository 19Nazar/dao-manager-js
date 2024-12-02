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
import AddUpdateRole from "./components/add_update_role";
import { ServiceDAO } from "../../../service/service";

export default function SettingsDao() {
  const router = useRouter();
  const daoManagerJS = DaoManagerJS.getInstance();
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);

  const { onOpen, onOpenChange } = useDisclosure();
  const [isChangePolicyOpen, setIsChangePolicyOpen] = useState(false);
  const [isAddUpdateRoleOpen, setIsAddUpdateRoleOpen] = useState(false);

  const [settings, setSettings] = useState<object | null>(null);

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
      console.log(settings);
      setSettings(settings.data);
    }
    if (daoID) {
      getSettings(daoID);
    }
  }, []);

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
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 10,
                  }}
                >
                  <CustomButton
                    text="Change Policy"
                    onClick={() => setIsChangePolicyOpen(true)}
                  />
                  <ChangePolicy
                    daoID={daoID}
                    onOpenChange={() => setIsChangePolicyOpen(false)}
                    isOpen={isChangePolicyOpen}
                  />
                  {/* <CustomButton
                    text="Add | Update Role"
                    onClick={() => setIsAddUpdateRoleOpen(true)}
                  />
                  <AddUpdateRole
                    daoID={daoID}
                    onOpenChange={() => setIsAddUpdateRoleOpen(false)}
                    isOpen={isAddUpdateRoleOpen}
                  /> */}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import { UrlDashboard } from "../../../url_dashboard/url_dashboard";
import {
  ChangePolicyModel,
  ConnectionType,
  NetworkID,
  ProposalTypes,
  Role,
  VotePolicy,
} from "../../../../../../package/models/near_models";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ConstantsDashboard } from "../../../const/const";
import CustomButton from "../../../shared_widgets/custom_button";

export default function CreateDao() {
  const router = useRouter();
  const typeConnection = localStorage.getItem("connection");
  const network = localStorage.getItem("network");
  const daoManagerJS = DaoManagerJS.getInstance();
  const dataDefault = localStorage.getItem("my-app_default_auth_key");
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [settings, setSettings] = useState<object | null>(null);

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

  function RenderObject({ data }) {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? (
                <RenderObject data={value} />
              ) : (
                value.toString()
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{data}</span>;
  }

  async function createPolicy({
    contractId,
    description,
    roles,
    default_vote_policy,
    bounty_forgiveness_period,
    bounty_bond,
    proposal_period,
    proposal_bond,
  }: {
    contractId: string;
    description: string;
    roles: Array<Role>;
    default_vote_policy: VotePolicy;
    bounty_forgiveness_period: string;
    bounty_bond: string;
    proposal_period: string;
    proposal_bond: string;
  }) {
    const res = await daoManagerJS.addProposal({
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicy,
      addProposalModel: new ChangePolicyModel({
        roles: roles,
        default_vote_policy: default_vote_policy,
        bounty_forgiveness_period: bounty_forgiveness_period,
        bounty_bond: bounty_bond,
        proposal_period: proposal_period,
        proposal_bond: proposal_bond,
      }),
    });
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
                ) : (
                  <RenderObject data={settings} />
                )}

                <div className="flex justify-end w-full mt-4">
                  <CustomButton text="Change Policy" onClick={onOpen} />
                </div>
                <div className="flex justify-center">
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Change policy
                          </ModalHeader>
                          <ModalBody>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Nullam pulvinar risus non risus hendrerit
                              venenatis. Pellentesque sit amet hendrerit risus,
                              sed porttitor quam.
                            </p>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Nullam pulvinar risus non risus hendrerit
                              venenatis. Pellentesque sit amet hendrerit risus,
                              sed porttitor quam.
                            </p>
                            <p>
                              Magna exercitation reprehenderit magna aute tempor
                              cupidatat consequat elit dolor adipisicing. Mollit
                              dolor eiusmod sunt ex incididunt cillum quis.
                              Velit duis sit officia eiusmod Lorem aliqua enim
                              laboris do dolor eiusmod. Et mollit incididunt
                              nisi consectetur esse laborum eiusmod pariatur
                              proident Lorem eiusmod et. Culpa deserunt nostrud
                              ad veniam.
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <CustomButton
                              text="Change Policy"
                              onClick={onClose}
                            />
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

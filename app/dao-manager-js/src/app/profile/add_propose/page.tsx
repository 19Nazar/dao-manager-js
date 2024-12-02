"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import {
  BlockChainResponse,
  ProposalTypes,
} from "../../../../../../package/models/near_models";
import {
  Button,
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

export default function AddProposeDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();
  const daoID = localStorage.getItem(ConstantsDashboard.daoId);

  const [resData, setResData] = useState<BlockChainResponse | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectLable, setSelectLable] = useState<string | null>(null);

  ServiceDAO.checkAuth(router);

  useEffect(() => {
    async function getHesh({ txnHesh, accountId }) {
      const resp = await daoManagerJS.getResultTxns({
        txnHesh: txnHesh,
        accountId: accountId,
      });
      console.log(resp);
      setResData(resp);
    }
    const accountID = daoManagerJS.getAccountID();
    const hesh = searchParams.get("transactionHashes");
    if (hesh) {
      getHesh({ txnHesh: hesh, accountId: accountID });
    }
  }, []);

  const proposalsWidgets: Record<string, JSX.Element> = {
    [ProposalTypes.AddBounty]: <AddBounty daoID={daoID || ""} />,
    [ProposalTypes.AddMemberToRole]: (
      <AddRemoveMemberToRole daoID={daoID || ""} />
    ),
    [ProposalTypes.Transfer]: <Transfer daoID={daoID || ""} />,
    [ProposalTypes.ChangeConfig]: <ChangeConfig daoID={daoID || ""} />,
    [ProposalTypes.BountyDone]: <BountyDone daoID={daoID || ""} />,
  };

  return (
    <div>
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <h4 className="font-bold text-large">Add proposal</h4>
            <div>
              {!daoID ? (
                <h1>For Interaction you must add DAO smart contract id</h1>
              ) : (
                <div>
                  <h4>
                    To make a proposal you need choose type propose and enter
                    the following parameters:
                  </h4>
                  <div
                    style={{
                      marginTop: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          style={{ backgroundColor: "#4FD1D9" }}
                          variant="bordered"
                        >
                          {selectLable ? selectLable : "Choose propose"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

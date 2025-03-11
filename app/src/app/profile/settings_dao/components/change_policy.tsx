import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import ChangeAllPolicy from "./variant_change_policy/change_all_settings";
import AddUpdateRole from "./variant_change_policy/add_update_role";
import RemoveRole from "./variant_change_policy/remove_role";
import UpdateParameters from "./variant_change_policy/update_parameters";
import UpdateDefaultVotePolicy from "./variant_change_policy/update_default_vote_policy";
import { ConstantsDashboard } from "src/const/const";
import ButtonSettings from "src/shared_widgets/ButtonSettings/ButtonSettings";
import { useState } from "react";
interface ChangePolicyProps {
  daoID: string;
  onOpenChange: () => void;
  isOpen: boolean;
  proposalCost: string;
}

const listTubs = [
  { title: "Change All Settings", value: "ChangeAllPolicyProps" },
  { title: "Add | Update Role", value: "AddUpdateRole" },
  { title: "Remove Role", value: "RemoveRole" },
  { title: "Update Parameters", value: "UpdateParameters" },
  { title: "Update Default Vote Policy", value: "UpdateDefaultVotePolicy" },
];
const ChangePolicy: React.FC<ChangePolicyProps> = ({
  daoID,
  onOpenChange,
  isOpen,
  proposalCost,
}) => {
  const [activeTub, setActiveTub] = useState<string>("ChangeAllPolicyProps");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      backdrop="blur"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "80px",
        maxWidth: `${ConstantsDashboard.maxWidth}px`,
        width: "100%",
        minWidth: "50px",
      }}
    >
      {/* style={{ overflow: "auto" }} */}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change policy
            </ModalHeader>
            <ModalBody>
              <div
                style={{
                  padding: "0.25rem",
                  backgroundColor: "#ededed",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#6b7280 transparent",
                  borderWidth: 0,
                  borderRadius: 120,
                  minWidth: "50px",
                  overflowX: "auto",
                  display: "flex",
                }}
              >
                {listTubs.map((tub) => (
                  <ButtonSettings
                    key={tub.value}
                    isActive={activeTub === tub.value}
                    onClick={() => setActiveTub(tub.value)}
                  >
                    {tub.title}
                  </ButtonSettings>
                ))}
              </div>

              {activeTub == "ChangeAllPolicyProps" && (
                <ChangeAllPolicy proposalCost={proposalCost} daoID={daoID} />
              )}

              {activeTub == "AddUpdateRole" && (
                <AddUpdateRole proposalCost={proposalCost} daoID={daoID} />
              )}

              {activeTub == "RemoveRole" && (
                <RemoveRole proposalCost={proposalCost} daoID={daoID} />
              )}

              {activeTub == "UpdateParameters" && (
                <UpdateParameters proposalCost={proposalCost} daoID={daoID} />
              )}

              {activeTub == "UpdateDefaultVotePolicy" && (
                <UpdateDefaultVotePolicy
                  proposalCost={proposalCost}
                  daoID={daoID}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangePolicy;

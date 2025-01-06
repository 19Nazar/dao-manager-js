import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import ChangeAllPolicy from "./variant_change_policy/change_all_settings";
import AddUpdateRole from "./variant_change_policy/add_update_role";
import RemoveRole from "./variant_change_policy/remove_role";
import UpdateParameters from "./variant_change_policy/update_parameters";
import UpdateDefaultVotePolicy from "./variant_change_policy/update_default_vote_policy";

interface ChangePolicyProps {
  daoID: string;
  onOpenChange: () => void;
  isOpen: boolean;
  proposalCost: string;
}
const ChangePolicy: React.FC<ChangePolicyProps> = ({
  daoID,
  onOpenChange,
  isOpen,
  proposalCost,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
      style={{ overflow: "visible", maxWidth: "100%", width: "auto" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change policy
            </ModalHeader>
            <ModalBody style={{ maxWidth: "100" }}>
              <Tabs
                fullWidth
                className="flex w-full flex-col"
                aria-label="Options"
                style={{ overflow: "visible", width: "auto" }}
              >
                <Tab key="ChangeAllPolicyProps" title="Change All Settings">
                  <ChangeAllPolicy proposalCost={proposalCost} daoID={daoID} />
                </Tab>
                <Tab key="AddUpdateRole" title="Add | Update Role">
                  <AddUpdateRole proposalCost={proposalCost} daoID={daoID} />
                </Tab>
                <Tab key="RemoveRole" title="Remove Role">
                  <RemoveRole proposalCost={proposalCost} daoID={daoID} />
                </Tab>
                <Tab key="UpdateParameters" title="Update Parameters">
                  <UpdateParameters proposalCost={proposalCost} daoID={daoID} />
                </Tab>
                <Tab
                  key="UpdateDefaultVotePolicy"
                  title="Update Default Vote Policy"
                >
                  <UpdateDefaultVotePolicy
                    proposalCost={proposalCost}
                    daoID={daoID}
                  />
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangePolicy;

import { Input, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import CustomButton from "../../../../../shared_widgets/custom_button";
import { useState } from "react";
import style from "../../../../style/profile.module.css";
import {
  ChangePolicyRemoveRoleModel,
  DaoManagerJS,
  ProposalTypes,
} from "dao-manager-js";

interface RemoveRoleProps {
  daoID: string;
  proposalCost: string;
}
const RemoveRole: React.FC<RemoveRoleProps> = ({ daoID, proposalCost }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);

  const [roleName, setRoleName] = useState<string | undefined>(undefined);
  //vote_policy?: object | undefined;

  async function changePolicyRemoveRole({
    contractId,
    description,
    roleName,
  }: {
    contractId: string;
    description: string;
    roleName: string;
  }): Promise<void> {
    await daoManagerJS.addProposal({
      deposit: proposalCost,
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicyRemoveRole,
      addProposalModel: new ChangePolicyRemoveRoleModel({
        roleName: roleName,
      }),
    });
  }

  return (
    <div className={style.settings_model}>
      <ModalHeader className="flex flex-col gap-1">Remove role</ModalHeader>
      <ModalBody>
        <Input
          className="mt-3"
          autoFocus
          label="Description"
          placeholder="Enter description"
          variant="bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <Input
            className="mt-3"
            autoFocus
            label="Role Name"
            placeholder="Enter role name"
            variant="bordered"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton
          text="Remove Role"
          onClick={async () => {
            await changePolicyRemoveRole({
              contractId: daoID,
              description: description,
              roleName: roleName,
            });
          }}
        />
      </ModalFooter>
    </div>
  );
};

export default RemoveRole;

import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import {
  AddMemberToRoleModel,
  ProposalTypes,
  RemoveMemberFromRoleModel,
} from "../../../../../../../package/models/near_models";
import { useState } from "react";

interface AddMemberToRoleProps {
  daoID: string;
}
const AddMemberToRole: React.FC<AddMemberToRoleProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [memberId, setMemberId] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  async function addMemberToRole({
    description,
    member_id,
    role: role,
  }: {
    description: string;
    member_id: string;
    role: string;
  }) {
    await daoManagerJS.addProposal({
      deposit: "1000000000000000000000000",
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.AddMemberToRole,
      addProposalModel: new AddMemberToRoleModel({
        member_id: member_id,
        role: role,
      }),
    });
  }

  async function removeMemberFromRole({
    description,
    member_id,
    role: role,
  }: {
    description: string;
    member_id: string;
    role: string;
  }) {
    await daoManagerJS.addProposal({
      deposit: "1000000000000000000000000",
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.RemoveMemberFromRole,
      addProposalModel: new RemoveMemberFromRoleModel({
        member_id: member_id,
        role: role,
      }),
    });
  }
  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Add member to role</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Input
            className="mt-4"
            autoFocus
            label="Description"
            placeholder="Enter description"
            variant="bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Member ID"
            placeholder="Enter member id"
            variant="bordered"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Role"
            placeholder="Enter role"
            variant="bordered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <CustomButton
                style={{ marginTop: 17, backgroundColor: "red" }}
                text={"Remove member"}
                onClick={async () => {
                  await removeMemberFromRole({
                    description: description,
                    member_id: memberId,
                    role: role,
                  });
                }}
              />
            </div>
            <div>
              <CustomButton
                style={{ marginTop: 17, backgroundColor: "green" }}
                text={"Add member"}
                onClick={async () => {
                  await addMemberToRole({
                    description: description,
                    member_id: memberId,
                    role: role,
                  });
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddMemberToRole;

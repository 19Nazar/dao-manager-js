import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import { useState } from "react";
import { BountyDoneModel, DaoManagerJS, ProposalTypes } from "dao-manager-js";

interface BountyDoneProps {
  daoID: string;
}
const BountyDone: React.FC<BountyDoneProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [bountyId, setBountyId] = useState<string | undefined>(undefined);
  const [receiverId, setReceiverId] = useState<string | undefined>(undefined);

  async function bountyDone({
    description,
    bounty_id,
    receiver_id,
  }: {
    description: string;
    bounty_id: number;
    receiver_id: string;
  }) {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    await daoManagerJS.addProposal({
      deposit: settings.data["proposal_bond"],
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.BountyDone,
      addProposalModel: new BountyDoneModel({
        bounty_id: bounty_id,
        receiver_id: receiver_id,
      }),
    });
  }
  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Bounty Done</h4>
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
            label="Bounty id"
            placeholder="Enter bounty id"
            variant="bordered"
            value={bountyId}
            onChange={(e) => setBountyId(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Receiver ID"
            placeholder="Enter receiver id"
            variant="bordered"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />

          <CustomButton
            style={{ marginTop: 17 }}
            text={"Bounty Done"}
            onClick={async () => {
              await bountyDone({
                description: description,
                bounty_id: Number(bountyId),
                receiver_id: receiverId,
              });
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default BountyDone;

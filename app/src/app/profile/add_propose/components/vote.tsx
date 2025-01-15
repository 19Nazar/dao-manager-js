import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import { useState } from "react";
import { DaoManagerJS, ProposalTypes, VoteModel } from "dao-manager-js";

interface TransferProps {
  daoID: string;
}
const Transfer: React.FC<TransferProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);

  async function vote({ description }: { description: string }) {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    const res = await daoManagerJS.addProposal({
      deposit: settings.data["proposal_bond"],
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.Vote,
      addProposalModel: new VoteModel(),
    });
  }
  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Vote</h4>
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
          <CustomButton
            style={{ marginTop: 17 }}
            text={"Transfer"}
            onClick={async () => {
              await vote({
                description: description,
              });
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Transfer;

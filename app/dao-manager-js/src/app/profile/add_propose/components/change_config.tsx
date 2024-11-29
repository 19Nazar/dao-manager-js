import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import { useState } from "react";
import {
  ChangeConfigModel,
  ProposalTypes,
  TransferModel,
  Utils,
} from "../../../../../../../package/index";

interface ChangeConfigProps {
  daoID: string;
}
const ChangeConfig: React.FC<ChangeConfigProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [nameDao, setName] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);
  const [metadata, setMetadata] = useState<string | undefined>(undefined);

  async function changeConfig({
    description,
    name,
    purpose,
    metadata,
  }: {
    description: string;
    name: string;
    purpose: string;
    metadata?: string;
  }) {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });
    await daoManagerJS.addProposal({
      deposit: settings.data["proposal_bond"],
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.ChangeConfig,
      addProposalModel: new ChangeConfigModel({
        name: name,
        purpose: purpose,
        metadata: metadata,
      }),
    });
  }
  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Change Config</h4>
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
            label="Name DAO"
            placeholder="Enter name DAO "
            variant="bordered"
            value={nameDao}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Purpose"
            placeholder="Enter purpose"
            variant="bordered"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Metadata(Options)"
            placeholder="Enter metadata"
            variant="bordered"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />

          <CustomButton
            style={{ marginTop: 17 }}
            text={"Change Config"}
            onClick={async () => {
              await changeConfig({
                description: description,
                name: nameDao,
                purpose: purpose,
                metadata: metadata,
              });
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ChangeConfig;

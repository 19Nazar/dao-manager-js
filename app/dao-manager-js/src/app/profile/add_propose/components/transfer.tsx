import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import { useState } from "react";
import {
  ProposalTypes,
  TransferModel,
  Utils,
} from "../../../../../../../package/index";

interface TransferProps {
  daoID: string;
}
const Transfer: React.FC<TransferProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [token_id, setToken_id] = useState<string | undefined>(undefined);
  const [receiver_id, setReceiver_id] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  async function transfer({
    description,
    token_id,
    receiver_id,
    amount,
  }: {
    description: string;
    token_id: string;
    receiver_id: string;
    amount: string;
  }) {
    const yctoNear = Utils.nearToYoctoNEAR(amount);

    await daoManagerJS.addProposal({
      deposit: "1000000000000000000000000",
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.Transfer,
      addProposalModel: new TransferModel({
        token_id: token_id,
        receiver_id: receiver_id,
        amount: yctoNear,
      }),
    });
  }
  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Transfer</h4>
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
            label="Token ID(Optional)"
            placeholder="Enter token id"
            variant="bordered"
            value={token_id}
            onChange={(e) => setToken_id(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Receiver ID"
            placeholder="Enter receiver id"
            variant="bordered"
            value={receiver_id}
            onChange={(e) => setReceiver_id(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Amount(NEAR)"
            placeholder="Enter amount"
            variant="bordered"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <CustomButton
            style={{ marginTop: 17 }}
            text={"Add member"}
            onClick={async () => {
              await transfer({
                description: description,
                token_id: token_id,
                receiver_id: receiver_id,
                amount: amount,
              });
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Transfer;

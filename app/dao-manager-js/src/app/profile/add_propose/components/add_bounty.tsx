import {
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
} from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import {
  AddBountyModel,
  ProposalTypes,
} from "../../../../../../../package/models/near_models";
import { useState } from "react";
import { getLocalTimeZone } from "@internationalized/date";
import { Utils } from "../../../../../../../package/utils/utils";

interface AddBountyProps {
  daoID: string;
}
const AddBounty: React.FC<AddBountyProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [descriptionPropose, setDescriptionPropose] = useState<
    string | undefined
  >(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [times, setTimes] = useState<string>("1");
  const [maxDeadline, setMaxDeadline] = useState<string | undefined>(undefined);

  async function addBounty({
    description,
    descriptionPropose,
    token,
    amount,
    times,
    max_deadline,
  }: {
    max_deadline: string;
    times: number;
    amount: string;
    token: string;
    description: string;
    descriptionPropose: string;
  }) {
    const yctoNear = Utils.nearToYoctoNEAR(amount);
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    daoManagerJS.addProposal({
      contractId: daoID,
      description: description,
      deposit: settings.data["proposal_bond"],
      proposalTypes: ProposalTypes.AddBounty,
      addProposalModel: new AddBountyModel({
        description: descriptionPropose,
        token: token,
        amount: yctoNear,
        times: times,
        max_deadline: max_deadline,
      }),
    });
  }

  const handleDateChange = (date) => {
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());

      const unixTimestamp = jsDate.getTime();

      setMaxDeadline(unixTimestamp.toString());
    }
  };

  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Add bounty</h4>
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
            label="Description propose"
            placeholder="Enter description purpose"
            variant="bordered"
            value={descriptionPropose}
            onChange={(e) => setDescriptionPropose(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Token"
            placeholder="Enter token"
            variant="bordered"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
          <Input
            className="mt-5"
            autoFocus
            label="Times"
            placeholder="Enter number of repetitions"
            variant="bordered"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
          />
          <div style={{ marginTop: 15 }}>
            <h1>Deadline</h1>
            <DatePicker className="mt-1" onChange={handleDateChange} />
          </div>
          <CustomButton
            style={{ marginTop: 17 }}
            text={"Add Bounty"}
            onClick={async () => {
              await addBounty({
                description: description,
                descriptionPropose: descriptionPropose,
                token: token,
                amount: amount,
                times: Number(times),
                max_deadline: maxDeadline,
              });
            }}
          />
          {/* {resData ? (
          <h1
            className={resData.status === Status.successful ? "" : "text-red"}
          >
            {atob(resData.data?.toString()) || "Absent data"}
          </h1>
        ) : (
          ""
        )} */}
        </CardBody>
      </Card>
    </div>
  );
};

export default AddBounty;

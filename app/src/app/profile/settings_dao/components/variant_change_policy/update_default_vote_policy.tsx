import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import CustomButton from "../../../../../shared_widgets/custom_button";
import { useState } from "react";
import style from "../../../../style/profile.module.css";
import {
  ChangePolicyUpdateDefaultVotePolicyModel,
  DaoManagerJS,
  ProposalTypes,
  VotePolicy,
  WeightKind,
} from "dao-manager-js";

interface UpdateDefaultVotePolicyProps {
  daoID: string;
  proposalCost: string;
}
const UpdateDefaultVotePolicy: React.FC<UpdateDefaultVotePolicyProps> = ({
  daoID,
  proposalCost,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [weightKind, setWeight_kind] = useState<string | undefined>(undefined);
  const [threshold, setThreshold] = useState<Array<string>>([]);
  const [quorum, setQuorum] = useState<string | undefined>(undefined);

  async function changePolicyUpdateDefaultVotePolicy({
    contractId,
    description,
    weightKind,
    threshold,
    quorum,
  }: {
    quorum: string;
    threshold: Array<string>;
    weightKind: string;
    contractId: string;
    description: string;
  }): Promise<void> {
    const defaultVotePolicy = new VotePolicy({
      weight_kind:
        weightKind == WeightKind.RoleWeight
          ? WeightKind.RoleWeight
          : WeightKind.TokenWeight,
      threshold: threshold.map((num) => Number(num)),
      quorum: quorum,
    });
    await daoManagerJS.addProposal({
      deposit: proposalCost,
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicyUpdateDefaultVotePolicy,
      addProposalModel: new ChangePolicyUpdateDefaultVotePolicyModel({
        vote_policy: defaultVotePolicy,
      }),
    });
  }

  return (
    <div className={style.settings_model}>
      <ModalHeader className="flex flex-col gap-1">
        Update default vote policy
      </ModalHeader>
      <ModalBody>
        <Input
          className="mt-4"
          autoFocus
          label="Description"
          placeholder="Enter description"
          variant="bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h1 className="mt-4">Default vote policy</h1>
        <Dropdown>
          <DropdownTrigger>
            <Button className="bg-white" variant="bordered">
              {weightKind ? weightKind : "Chose weight kind"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Network Selection"
            variant="faded"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={weightKind}
            onSelectionChange={(keys) => setWeight_kind(keys.currentKey)}
          >
            <DropdownItem key={WeightKind.RoleWeight}>Role Weight</DropdownItem>
            <DropdownItem key={WeightKind.TokenWeight}>
              Token Weight
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          className="mt-3"
          autoFocus
          label="Threshold(percent write whit comma ',')"
          placeholder="Enter threshold"
          variant="bordered"
          value={threshold.join(",")}
          onChange={(e) =>
            setThreshold(e.target.value.split(",").map((item) => item.trim()))
          }
        />
        <Input
          className="mt-3"
          autoFocus
          label="Quorum"
          placeholder="Enter quorum"
          variant="bordered"
          value={quorum}
          onChange={(e) => setQuorum(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <CustomButton
          text="Change All Policy"
          onClick={async () => {
            await changePolicyUpdateDefaultVotePolicy({
              contractId: daoID,
              description: description,
              weightKind: weightKind,
              threshold: threshold,
              quorum: quorum,
            });
          }}
        />
      </ModalFooter>
    </div>
  );
};

export default UpdateDefaultVotePolicy;

import { Input, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import CustomButton from "../../../../../shared_widgets/custom_button";
import { useState } from "react";
import style from "../../../../style/profile.module.css";
import {
  ChangePolicyUpdateParametersModel,
  DaoManagerJS,
  ProposalTypes,
  Utils,
} from "dao-manager-js";

interface UpdateParametersProps {
  daoID: string;
  proposalCost: string;
}
const UpdateParameters: React.FC<UpdateParametersProps> = ({
  daoID,
  proposalCost,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [bountyBond, setBountyBond] = useState<string | undefined>(undefined);
  const [proposalDay, setProposalDay] = useState<number | undefined>(undefined);
  const [proposalHour, setProposalHour] = useState<number | undefined>(
    undefined,
  );
  const [bountyMinute, setBountyMinute] = useState<number | undefined>(
    undefined,
  );
  const [bountyDay, setBountyDay] = useState<number | undefined>(undefined);
  const [bountyHour, setBountyHour] = useState<number | undefined>(undefined);
  const [proposalMinute, setProposalMinute] = useState<number | undefined>(
    undefined,
  );
  const [proposalBond, setProposalBond] = useState<string | undefined>(
    undefined,
  );

  async function changePolicyUpdateParameters({
    description,
    bounty_bond,
    proposal_bond,
    proposalDay,
    proposalHour,
    proposalMinute,
    bountyDay,
    bountyMinute,
    bountyHour,
  }: {
    bountyDay?: number;
    bountyMinute?: number;
    bountyHour?: number;
    proposalDay?: number;
    proposalHour?: number;
    proposalMinute?: number;
    description: string;
    bounty_bond?: string;
    proposal_bond?: string;
  }) {
    const proposalNanoseconds =
      proposalDay || proposalHour || proposalMinute
        ? (proposalDay || 0) * 24 * 60 * 60 * 1e9 +
          (proposalHour || 0) * 60 * 60 * 1e9 +
          (proposalMinute || 0) * 60 * 1e9
        : null;

    const bountyNanoseconds =
      bountyDay || bountyHour || bountyMinute
        ? (bountyDay || 0) * 24 * 60 * 60 * 1e9 +
          (bountyHour || 0) * 60 * 60 * 1e9 +
          (bountyMinute || 0) * 60 * 1e9
        : null;

    const yoctoNearProposal = proposal_bond
      ? Utils.nearToYoctoNEAR(proposal_bond)
      : null;
    const yoctoNearBounty = bounty_bond
      ? Utils.nearToYoctoNEAR(bounty_bond)
      : null;

    const res = await daoManagerJS.addProposal({
      deposit: proposalCost,
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicyUpdateParameters,
      addProposalModel: new ChangePolicyUpdateParametersModel({
        bounty_bond: yoctoNearBounty,
        bounty_forgiveness_period: bountyNanoseconds
          ? bountyNanoseconds.toString()
          : null,
        proposal_period: proposalNanoseconds
          ? proposalNanoseconds.toString()
          : null,
        proposal_bond: yoctoNearProposal,
      }),
    });
  }

  return (
    <div className={style.settings_model}>
      <ModalHeader className="flex flex-col gap-1">
        Update Parameters
      </ModalHeader>
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

        <h1>Bounty period</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Input
            className="mt-4"
            autoFocus
            label="Bounty Day"
            placeholder="Day"
            variant="bordered"
            value={bountyDay?.toString()}
            onChange={(e) => setBountyDay(Number(e.target.value))}
          />
          <Input
            className="mt-4"
            autoFocus
            label="Bounty Hour"
            placeholder="Hour"
            variant="bordered"
            value={bountyHour?.toString()}
            onChange={(e) => setBountyHour(Number(e.target.value))}
          />
          <Input
            className="mt-4"
            autoFocus
            label="Bounty Minute"
            placeholder="Minute"
            variant="bordered"
            value={bountyMinute?.toString()}
            onChange={(e) => setBountyMinute(Number(e.target.value))}
          />
        </div>
        <Input
          className="mt-4"
          autoFocus
          label="Bounty Bond(Near)"
          placeholder="Enter bounty bond"
          variant="bordered"
          value={bountyBond}
          onChange={(e) => setBountyBond(e.target.value)}
        />

        <h1>Proposal period</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Input
            className="mt-4"
            autoFocus
            label="Proposal Day"
            placeholder="Day"
            variant="bordered"
            value={proposalDay?.toString()}
            onChange={(e) => setProposalDay(Number(e.target.value))}
          />
          <Input
            className="mt-4"
            autoFocus
            label="Proposal Hour"
            placeholder="Hour"
            variant="bordered"
            value={proposalHour?.toString()}
            onChange={(e) => setProposalHour(Number(e.target.value))}
          />
          <Input
            className="mt-4"
            autoFocus
            label="Proposal Minute"
            placeholder="Minute"
            variant="bordered"
            value={proposalMinute?.toString()}
            onChange={(e) => setProposalMinute(Number(e.target.value))}
          />
        </div>
        <Input
          className="mt-4"
          autoFocus
          label="Proposal Bond(Near)"
          placeholder="Enter proposal bond"
          variant="bordered"
          value={proposalBond}
          onChange={(e) => setProposalBond(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <CustomButton
          text="Update Parameters"
          onClick={async () => {
            await changePolicyUpdateParameters({
              description: description,
              bounty_bond: bountyBond,
              proposalDay: proposalDay,
              proposalMinute: proposalMinute,
              proposalHour: proposalHour,
              proposal_bond: proposalBond,
            });
          }}
        />
      </ModalFooter>
    </div>
  );
};

export default UpdateParameters;

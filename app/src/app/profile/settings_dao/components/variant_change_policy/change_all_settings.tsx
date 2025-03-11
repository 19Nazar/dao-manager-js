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
  AllKind,
  ChangePolicyModel,
  DaoManagerJS,
  KindDefault,
  ProposalTypes,
  Role,
  Utils,
  VotePolicy,
  WeightKind,
} from "dao-manager-js";

interface ChangeAllPolicyProps {
  daoID: string;
  proposalCost: string;
}
const ChangeAllPolicy: React.FC<ChangeAllPolicyProps> = ({
  daoID,
  proposalCost,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [bountyBond, setBountyBond] = useState<string | undefined>(undefined);
  const [proposalBond, setProposalBond] = useState<string | undefined>(
    undefined,
  );
  const [weightKind, setWeight_kind] = useState<string | undefined>(undefined);
  const [threshold, setThreshold] = useState<Array<string>>([]);
  const [quorum, setQuorum] = useState<string | undefined>(undefined);

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

  interface roleI {
    name: string | undefined;
    kind: AllKind | undefined;
    permissions: Array<string> | undefined;
    //create in future
    vote_policy?: object | undefined;
  }

  const [roles, setRoles] = useState<roleI[]>([]);

  function addRole() {
    setRoles([
      ...roles,
      {
        name: undefined,
        kind: undefined,
        permissions: undefined,
        vote_policy: undefined,
      },
    ]);
  }

  const updateRole = (index: number, field: string, value: any) => {
    const updatedRoles = roles.map((role, i) =>
      i === index ? { ...role, [field]: value } : role,
    );
    setRoles(updatedRoles);
  };

  async function createPolicy({
    contractId,
    description,
    roles,
    bounty_bond,
    proposal_bond,
    weightKind,
    threshold,
    quorum,
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
    quorum: string;
    threshold: Array<string>;
    weightKind: string;
    contractId: string;
    description: string;
    roles: Array<roleI>;
    bounty_bond: string;
    proposal_bond: string;
  }): Promise<void> {
    if (bountyDay == null && bountyMinute == null && bountyHour == null) {
      throw new Error("You must input bounty period");
    }
    if (proposalDay == null && proposalHour == null && proposalMinute == null) {
      throw new Error("You must input proposal period");
    }
    const proposalNanoseconds =
      (proposalDay || 0) * 24 * 60 * 60 * 1e9 +
      (proposalHour || 0) * 60 * 60 * 1e9 +
      (proposalMinute || 0) * 60 * 1e9;

    const bountyNanoseconds =
      (bountyDay || 0) * 24 * 60 * 60 * 1e9 +
      (bountyHour || 0) * 60 * 60 * 1e9 +
      (bountyMinute || 0) * 60 * 1e9;

    const finishedRoles = roles.map((role) => {
      return new Role({
        name: role.name,
        kind: role.kind,
        permissions: role.permissions,
        vote_policy: role.vote_policy,
      });
    });
    const defaultVotePolicy = new VotePolicy({
      weight_kind:
        weightKind == WeightKind.RoleWeight
          ? WeightKind.RoleWeight
          : WeightKind.TokenWeight,
      threshold: threshold.map((num) => Number(num)),
      quorum: quorum,
    });
    const bounty_bond_YctoNear = Utils.nearToYoctoNEAR(bounty_bond);
    const proposal_bond_YctoNear = Utils.nearToYoctoNEAR(proposal_bond);
    await daoManagerJS.addProposal({
      deposit: proposalCost,
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicy,
      addProposalModel: new ChangePolicyModel({
        roles: finishedRoles,
        default_vote_policy: defaultVotePolicy,
        bounty_forgiveness_period: bountyNanoseconds.toString(),
        bounty_bond: bounty_bond_YctoNear,
        proposal_period: proposalNanoseconds.toString(),
        proposal_bond: proposal_bond_YctoNear,
      }),
    });
  }

  return (
    <div className={style.settings_model}>
      <ModalHeader className="flex flex-col gap-1">
        Change all policy
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
          label="Bounty Bond (NEAR)"
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
          label="Proposal Bond (NEAR)"
          placeholder="Enter proposal bond"
          variant="bordered"
          value={proposalBond}
          onChange={(e) => setProposalBond(e.target.value)}
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
        <h1 className="mt-4">Roles</h1>
        {roles.map((role, index) => (
          <div key={index}>
            <Input
              className="mt-3"
              autoFocus
              label="Name"
              placeholder="Enter name"
              variant="bordered"
              value={role.name}
              onChange={(e) => updateRole(index, "name", e.target.value)}
            />
            <Input
              className="mt-3"
              autoFocus
              label="Permissions(percent write whit comma ',')"
              placeholder="Enter permissions"
              variant="bordered"
              value={role.permissions?.join(",")}
              onChange={(e) =>
                updateRole(
                  index,
                  "permissions",
                  e.target.value.split(",").map((item) => item.trim()),
                )
              }
            />
            <h1 className="mt-3">Choose and input kind</h1>
            <div style={{ border: "bold" }}>
              <Dropdown>
                <DropdownTrigger>
                  <Button className="bg-white" variant="bordered">
                    {Object.values(KindDefault).includes(role.kind?.kind)
                      ? role.kind.kind.toString()
                      : "Choose default kind"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Network Selection"
                  variant="faded"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={role.kind?.kind}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as KindDefault;
                    updateRole(
                      index,
                      "kind",
                      new AllKind({
                        kind: selectedKey,
                      }),
                    );
                  }}
                >
                  <DropdownItem key={KindDefault.Everyone}>
                    Everyone
                  </DropdownItem>
                  <DropdownItem key={KindDefault.Member}>Member</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <h1>OR</h1>
              <Input
                className="mt-3"
                autoFocus
                label="Kind group(percent write whit comma ',')"
                placeholder="Enter kind group"
                variant="bordered"
                value={role.kind?.group?.Group?.join(",")}
                onChange={(e) =>
                  updateRole(
                    index,
                    "kind",
                    new AllKind({
                      group: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    }),
                  )
                }
              />
            </div>
          </div>
        ))}
        <CustomButton text="Add lable for role" onClick={addRole} />
      </ModalBody>
      <ModalFooter>
        <CustomButton
          text="Change All Settings"
          onClick={async () => {
            await createPolicy({
              contractId: daoID,
              description: description,
              roles: roles,
              bounty_bond: bountyBond,
              proposal_bond: proposalBond,
              weightKind: weightKind,
              threshold: threshold,
              quorum: quorum,
              proposalDay: proposalDay,
              proposalHour: proposalHour,
              proposalMinute: proposalMinute,
              bountyDay: bountyDay,
              bountyMinute: bountyMinute,
              bountyHour: bountyHour,
            });
          }}
        />
      </ModalFooter>
    </div>
  );
};

export default ChangeAllPolicy;

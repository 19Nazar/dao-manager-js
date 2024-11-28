import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import {
  AllKind,
  ChangePolicyModel,
  KindDefault,
  ProposalTypes,
  Role,
  VotePolicy,
  WeightKind,
} from "../../../../../../../package/models/near_models";
import { useState } from "react";
import { Utils } from "../../../../../../../package/index";

interface SettingsModalProps {
  daoID: string;
  onOpenChange: () => void;
  isOpen: boolean;
}
const SettingsModal: React.FC<SettingsModalProps> = ({
  daoID,
  onOpenChange,
  isOpen,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [bountyForgivenessPeriod, setBountyForgivenessPeriod] = useState<
    string | undefined
  >(undefined);
  const [bountyBond, setBountyBond] = useState<string | undefined>(undefined);
  const [proposalPeriod, setProposalPeriod] = useState<string | undefined>(
    undefined,
  );
  const [proposalBond, setProposalBond] = useState<string | undefined>(
    undefined,
  );
  //default vote policy
  const [weightKind, setWeight_kind] = useState<string | undefined>(undefined);
  // to numb
  const [threshold, setThreshold] = useState<Array<string>>([]);
  // to numb
  const [quorum, setQuorum] = useState<number | undefined>(undefined);

  interface roleI {
    name: string | undefined;
    kind: AllKind | undefined;
    permissions: Array<string> | undefined;
    //create in future
    vote_policy?: object | undefined;
    balance?: string | undefined;
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
        balance: undefined,
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
    bounty_forgiveness_period,
    bounty_bond,
    proposal_period,
    proposal_bond,
    weightKind,
    threshold,
    quorum,
  }: {
    quorum: number;
    threshold: Array<string>;
    weightKind: string;
    contractId: string;
    description: string;
    roles: Array<roleI>;
    bounty_forgiveness_period: string;
    bounty_bond: string;
    proposal_period: string;
    proposal_bond: string;
  }) {
    const finishedRoles = roles.map((role) => {
      return new Role({
        name: role.name,
        kind: role.kind,
        permissions: role.permissions,
        vote_policy: role.vote_policy,
        balance: role.balance,
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
    const res = await daoManagerJS.addProposal({
      deposit: Utils.nearToYoctoNEAR("1"),
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicy,
      addProposalModel: new ChangePolicyModel({
        roles: finishedRoles,
        default_vote_policy: defaultVotePolicy,
        bounty_forgiveness_period: bounty_forgiveness_period,
        bounty_bond: bounty_bond,
        proposal_period: proposal_period,
        proposal_bond: proposal_bond,
      }),
    });
  }

  return (
    <div className="flex justify-center">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Change policy
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
                <Input
                  className="mt-4"
                  autoFocus
                  label="Bounty Forgiveness Period"
                  placeholder="Enter bounty forgiveness period"
                  variant="bordered"
                  value={bountyForgivenessPeriod}
                  onChange={(e) => setBountyForgivenessPeriod(e.target.value)}
                />
                <Input
                  className="mt-4"
                  autoFocus
                  label="Bounty Bond"
                  placeholder="Enter bounty bond"
                  variant="bordered"
                  value={bountyBond}
                  onChange={(e) => setBountyBond(e.target.value)}
                />
                <Input
                  className="mt-4"
                  autoFocus
                  label="Proposal Period"
                  placeholder="Enter proposal period"
                  variant="bordered"
                  value={proposalPeriod}
                  onChange={(e) => setProposalPeriod(e.target.value)}
                />
                <Input
                  className="mt-4"
                  autoFocus
                  label="Proposal Bond"
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
                    onSelectionChange={(keys) =>
                      setWeight_kind(keys.currentKey)
                    }
                  >
                    <DropdownItem key={WeightKind.RoleWeight}>
                      Role Weight
                    </DropdownItem>
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
                  onChange={(e) => setThreshold(e.target.value.split(","))}
                />
                <Input
                  className="mt-3"
                  autoFocus
                  label="Quorum"
                  placeholder="Enter quorum"
                  variant="bordered"
                  value={quorum?.toString()}
                  onChange={(e) => setQuorum(Number(e.target.value))}
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
                      onChange={(e) =>
                        updateRole(index, "name", e.target.value)
                      }
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
                          e.target.value.split(","),
                        )
                      }
                    />
                    <h1 className="mt-3">Choose and input kind</h1>
                    <div style={{ border: "bold" }}>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="bg-white" variant="bordered">
                            {Object.values(KindDefault).includes(
                              role.kind?.kind,
                            )
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
                            const selectedKey = Array.from(
                              keys,
                            )[0] as KindDefault;
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
                          <DropdownItem key={KindDefault.Member}>
                            Member
                          </DropdownItem>
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
                            new AllKind({ group: e.target.value.split(",") }),
                          )
                        }
                      />
                    </div>
                    <Input
                      className="mt-3"
                      autoFocus
                      label="Balance(optional)"
                      placeholder="Enter balance"
                      variant="bordered"
                      value={role.balance}
                      onChange={(e) =>
                        updateRole(index, "balance", e.target.value)
                      }
                    />
                  </div>
                ))}
                <CustomButton text="Add lable for role" onClick={addRole} />
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  text="Change Policy"
                  onClick={async () => {
                    await createPolicy({
                      contractId: daoID,
                      description: description,
                      roles: roles,
                      bounty_forgiveness_period: bountyForgivenessPeriod,
                      bounty_bond: bountyBond,
                      proposal_period: proposalPeriod,
                      proposal_bond: proposalBond,
                      weightKind: weightKind,
                      threshold: threshold,
                      quorum: quorum,
                    });
                  }}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SettingsModal;

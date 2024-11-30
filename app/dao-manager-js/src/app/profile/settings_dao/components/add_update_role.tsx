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
} from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import {
  AllKind,
  ChangePolicyAddOrUpdateRoleModel,
  KindDefault,
  ProposalTypes,
  Role,
} from "../../../../../../../package/models/near_models";
import { useState } from "react";
import { Utils } from "../../../../../../../package/index";

interface AddUpdateRoleProps {
  daoID: string;
  onOpenChange: () => void;
  isOpen: boolean;
}
const AddUpdateRole: React.FC<AddUpdateRoleProps> = ({
  daoID,
  onOpenChange,
  isOpen,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);

  const [name, setName] = useState<string | undefined>(undefined);
  const [permissions, setPermissions] = useState<Array<string> | undefined>([]);
  const [kind, setKind] = useState<AllKind | undefined>(undefined);
  //vote_policy?: object | undefined;

  async function ChangePolicyAddOrUpdateRole({
    contractId,
    description,
    name,
    permissions,
    vote_policy,
    kind,
  }: {
    contractId: string;
    description: string;
    name: string;
    permissions: Array<string>;
    vote_policy?: object;
    kind: AllKind;
  }) {
    const res = await daoManagerJS.addProposal({
      deposit: Utils.nearToYoctoNEAR("1"),
      contractId: contractId,
      description: description,
      proposalTypes: ProposalTypes.ChangePolicyAddOrUpdateRole,
      addProposalModel: new ChangePolicyAddOrUpdateRoleModel({
        role: new Role({
          name: name,
          kind: kind,
          permissions: permissions,
          vote_policy: vote_policy,
        }),
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
                Add or update role
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
                <h1 className="mt-4">Roles</h1>
                <div>
                  <Input
                    className="mt-3"
                    autoFocus
                    label="Name"
                    placeholder="Enter name"
                    variant="bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    className="mt-3"
                    autoFocus
                    label="Permissions(percent write whit comma ',')"
                    placeholder="Enter permissions"
                    variant="bordered"
                    value={permissions?.join(",")}
                    onChange={(e) =>
                      setPermissions(
                        e.target.value.split(",").map((item) => item.trim()),
                      )
                    }
                  />
                  <h1 className="mt-3">Choose and input kind</h1>
                  <div style={{ border: "bold" }}>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button className="bg-white" variant="bordered">
                          {Object.values(KindDefault).includes(kind?.kind)
                            ? kind.kind.toString()
                            : "Choose default kind"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Network Selection"
                        variant="faded"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={kind?.kind}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(
                            keys,
                          )[0] as KindDefault;
                          setKind(
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
                      value={kind?.group?.Group?.join(",")}
                      onChange={(e) =>
                        setKind(
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
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  text="Add | Update Role"
                  onClick={async () => {
                    await ChangePolicyAddOrUpdateRole({
                      contractId: daoID,
                      description: description,
                      name: name,
                      permissions: permissions,
                      kind: kind,
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

export default AddUpdateRole;
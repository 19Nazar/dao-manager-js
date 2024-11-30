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

import { useState } from "react";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import CustomButton from "../../../shared_widgets/custom_button";

interface ModelProposeProps {
  daoID: string;
  data: object;
  onOpenChange: () => void;
  isOpen: boolean;
}
const ModelPropose: React.FC<ModelProposeProps> = ({
  daoID,
  data,
  onOpenChange,
  isOpen,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);

  function RenderObject({ data }) {
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? (
                <RenderObject data={value} />
              ) : (
                value.toString()
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{data}</span>;
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
                <div>
                  <RenderObject data={data} />
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton text="test" onClick={async () => {}} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModelPropose;

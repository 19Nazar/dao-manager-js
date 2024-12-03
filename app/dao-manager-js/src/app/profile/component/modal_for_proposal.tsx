import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import CustomButton from "../../../shared_widgets/custom_button";
import { ActProposalModel } from "../../../../../../package/models/near_models";

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
  const [updatedData, setUpdatedData] = useState(data);
  const daoManagerJS = DaoManagerJS.getInstance();

  useEffect(() => {
    if (data["submission_time"]) {
      const milliseconds = data["submission_time"] / 1000000;
      const date = new Date(milliseconds);
      console.log(date);

      const newData = {
        ...data,
        submission_time: date.toDateString() + " time:" + date.toTimeString(),
      };
      setUpdatedData(newData);
    }
  }, [data]);

  function RenderObject({ data, depth = 0 }) {
    const indent = { marginLeft: `${depth * 20}px` };
    if (typeof data === "object" && data !== null) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key} style={indent}>
              <strong>{key}:</strong>
              {typeof value === "object" ? (
                <RenderObject data={value} depth={depth + 1} />
              ) : (
                value.toString()
              )}
            </li>
          ))}
        </ul>
      );
    }
    return <div>{data}</div>;
  }

  async function actProposal(actProposalModel: ActProposalModel) {
    const res = await daoManagerJS.actProposal({
      contractId: daoID,
      id: data["id"],
      action: actProposalModel,
    });
  }

  return (
    <div className="flex justify-center">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        style={{ maxWidth: "100%", width: "fit-content" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Act to propose
              </ModalHeader>
              <ModalBody>
                <div>
                  <RenderObject data={updatedData} />
                </div>
              </ModalBody>
              <ModalFooter
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <CustomButton
                  text="Vote Approve"
                  onClick={async () => {
                    await actProposal(ActProposalModel.VoteApprove);
                  }}
                />
                <CustomButton
                  text="Vote Reject"
                  onClick={async () => {
                    await actProposal(ActProposalModel.VoteReject);
                  }}
                />
                <CustomButton
                  text="Vote Remove"
                  onClick={async () => {
                    await actProposal(ActProposalModel.VoteRemove);
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

export default ModelPropose;

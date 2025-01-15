import React, { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  ModalContent,
} from "@nextui-org/react";

interface ResponseModalProps {
  resSuccessData: string;
  resFailureData: string;
  setResSuccessData: Dispatch<SetStateAction<string>>;
  setResFailureData: Dispatch<SetStateAction<string>>;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  resSuccessData,
  resFailureData,
  setResSuccessData,
  setResFailureData,
}) => {
  return (
    <>
      <Modal
        isOpen={!!resSuccessData}
        onClose={() => setResSuccessData(null)}
        placement="center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
          maxWidth: "100%",
          width: "auto",
          minWidth: "300px",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1>Successful</h1>
              </ModalHeader>
              <ModalBody>
                <p>
                  The operation was performed successfully. Response:
                  {resSuccessData}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setResSuccessData(null)}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={!!resFailureData}
        onClose={() => setResFailureData(null)}
        placement="center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
          maxWidth: "100%",
          width: "auto",
          minWidth: "300px",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h1>Error</h1>
              </ModalHeader>
              <ModalBody>
                <p>{resFailureData}</p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setResFailureData(null)}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResponseModal;

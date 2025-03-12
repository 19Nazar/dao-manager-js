import {
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState, useMemo } from "react";
import CustomButton from "../../../../shared_widgets/custom_button";
import { getLocalTimeZone } from "@internationalized/date";
import { DaoManagerJS } from "dao-manager-js";

interface ModelBountyProps {
  daoID: string;
  data: object;
  onOpenChange: () => void;
  isOpen: boolean;
}

const ModelBounty: React.FC<ModelBountyProps> = ({
  daoID,
  data,
  onOpenChange,
  isOpen,
}) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [maxDeadline, setMaxDeadline] = useState<string | undefined>(undefined);

  const formattedData = useMemo(() => {
    if (data["max_deadline"]) {
      const date = new Date(Number(data["max_deadline"]));

      return {
        ...data,
        amount: data["amount"] + " Near",
        max_deadline: date.toUTCString(),
      };
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

  const handleDateChange = (date) => {
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());

      const unixTimestamp = jsDate.getTime();

      setMaxDeadline(unixTimestamp.toString());
    }
  };

  async function claimBounty(deadline: string) {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    await daoManagerJS.claimBounty({
      deposit: settings.data["bounty_bond"],
      contractId: daoID,
      id: data["id"],
      deadline: deadline,
    });
  }

  async function giveUpBounty() {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    await daoManagerJS.giveUpBounty({
      deposit: settings.data["bounty_bond"],
      contractId: daoID,
      id: data["id"],
    });
  }

  async function doneBounty() {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });

    await daoManagerJS.doneBounty({
      deposit: settings.data["bounty_bond"],
      contractId: daoID,
      id: data["id"],
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
          {(_onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Interact with bounty
              </ModalHeader>
              <ModalBody>
                <div>
                  <RenderObject data={formattedData} />
                </div>
              </ModalBody>
              <ModalFooter
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <CustomButton
                  text="Claim Bounty"
                  onClick={() => {
                    setIsModelOpen(true);
                  }}
                />
                <Modal
                  isOpen={isModelOpen}
                  onOpenChange={() => setIsModelOpen(false)}
                  scrollBehavior="outside"
                  style={{ maxWidth: "100%", width: "fit-content" }}
                >
                  <ModalContent>
                    {(_onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Claim Bounty
                        </ModalHeader>
                        <ModalBody>
                          <div>
                            <h1>Choose deadline</h1>
                            <DatePicker
                              className="mt-5"
                              onChange={handleDateChange}
                            />
                          </div>
                        </ModalBody>
                        <ModalFooter
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <CustomButton
                            text="Claim Bounty"
                            onClick={async () => {
                              await claimBounty(maxDeadline);
                            }}
                          />
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <CustomButton
                  text="Give up Bounty"
                  onClick={async () => {
                    await giveUpBounty();
                  }}
                />
                <CustomButton
                  text="Done Bounty"
                  onClick={async () => {
                    await doneBounty();
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

export default ModelBounty;

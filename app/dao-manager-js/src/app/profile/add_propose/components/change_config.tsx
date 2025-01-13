import { Card, CardBody, CardHeader, Input, Spinner } from "@nextui-org/react";
import CustomButton from "../../../../shared_widgets/custom_button";
import DaoManagerJS from "../../../../../../../package/dao_manager_js_lib";
import { useState } from "react";
import {
  ChangeConfigModel,
  ProposalTypes,
  TransferModel,
  Utils,
} from "../../../../../../../package/index";
import ResponseModal from "../../../../shared_widgets/respone_modal";
import style from "../../../style/profile.module.css";
import { faUpload, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ChangeConfigProps {
  daoID: string;
}
const ChangeConfig: React.FC<ChangeConfigProps> = ({ daoID }) => {
  const daoManagerJS = DaoManagerJS.getInstance();
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [nameDao, setName] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);

  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);

  async function changeConfig({
    description,
    name,
    purpose,
    iconImage,
  }: {
    description: string;
    name: string;
    purpose: string;
    iconImage?: string;
  }) {
    const settings = await daoManagerJS.getPolicy({ contractId: daoID });
    await daoManagerJS.addProposal({
      deposit: settings.data["proposal_bond"],
      contractId: daoID,
      description: description,
      proposalTypes: ProposalTypes.ChangeConfig,
      addProposalModel: new ChangeConfigModel({
        name: name,
        purpose: purpose,
        metadata: iconImage ? JSON.stringify({ iconImage: iconImage }) : null,
      }),
    });
  }

  const handleImageUpload = async (event) => {
    setIsLoadingImage(true);
    const file = event.target.files[0];
    console.log(file.size);
    setFilename(file.name);

    if (!file) return;

    const MAX_SIZE = 500 * 1024;
    if (file.size > MAX_SIZE) {
      setResFailureData(
        "The file size exceeds 500 KB. Please upload a smaller file.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        const img = new Image();
        img.src = result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 32;
          canvas.height = 32;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 32, 32);

          const resizedBase64 = canvas.toDataURL("image/png");
          setImageBase64(JSON.stringify(resizedBase64));
        };
      } else {
        console.error("FileReader result is not a string");
      }
    };
    reader.readAsDataURL(file);
    setIsLoadingImage(false);
  };

  if (resFailureData || resSuccessData) {
    return (
      <div style={{ display: "flex" }}>
        <ResponseModal
          resFailureData={resFailureData}
          resSuccessData={resSuccessData}
          setResFailureData={setResFailureData}
          setResSuccessData={setResSuccessData}
        />
      </div>
    );
  }

  return (
    <div>
      <Card className="max-w-full shadow-lg">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Change Config</h4>
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
            label="Name DAO"
            placeholder="Enter name DAO "
            variant="bordered"
            value={nameDao}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="mt-5"
            autoFocus
            label="Purpose"
            placeholder="Enter purpose"
            variant="bordered"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <h1 style={{ marginTop: 20 }}>
            Add image icon. Maximum size is 500kb.(optional)
          </h1>
          <div className={style.upload_container}>
            <label className={style.upload_box}>
              {isLoadingImage == true ? (
                <Spinner />
              ) : imageBase64 != null ? (
                <>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ fontSize: "24px" }}
                  />
                  <h1
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 250,
                    }}
                  >
                    File add successful. Name file: {filename}
                  </h1>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={style.file_input}
                  />
                  <div className={style.upload_text}>
                    <p>Drag the image or press to select</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      maxHeight: 20,
                      height: "auto",
                      maxWidth: 20,
                      width: "auto",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUpload}
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </>
              )}
            </label>
          </div>

          <CustomButton
            style={{ marginTop: 17 }}
            text={"Change Config"}
            onClick={async () => {
              await changeConfig({
                description: description,
                name: nameDao,
                purpose: purpose,
                iconImage: imageBase64,
              });
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ChangeConfig;

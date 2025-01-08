"use client";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarComponent from "../../../shared_widgets/navbar";
import DaoManagerJS from "../../../../../../package/dao_manager_js_lib";
import {
  BlockChainResponse,
  Status,
} from "../../../../../../package/models/near_models";
import CustomButton from "../../../shared_widgets/custom_button";
import { Card, CardBody, CardHeader, Input, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ServiceDAO } from "../../../service/service";
import useTransactionStatus from "../../../service/useTransactionStatus";
import ResponseModal from "../../../shared_widgets/respone_modal";
import { ConstantsDashboard } from "../../../const/const";
import style from "../../style/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function CreateDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);

  const [nameDAO, setNameDAO] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);
  const [policy, setPolicy] = useState<string | undefined>(undefined);
  const [imageBase64, setImageBase64] = useState(null);
  const [resData, setResData] = useState<BlockChainResponse | undefined>(
    undefined,
  );
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  const [filename, setFilename] = useState<string | undefined>(undefined);

  ServiceDAO.checkAuth(router);

  useTransactionStatus(setResSuccessData, setResFailureData);

  useEffect(() => {
    console.log("imageBase64", imageBase64);
  }, [imageBase64]);

  async function createDAO({
    name,
    purpose,
    iconImage,
    policy,
  }: {
    name: string;
    purpose: string;
    iconImage?: string;
    policy?: string;
  }) {
    try {
      iconImage = iconImage ?? ConstantsDashboard.defaultImage;
      const convertPolicy = policy?.split(",").map((x) => x.trim());
      const test = await daoManagerJS.createDaoManager({
        name: name.toLocaleLowerCase(),
        purpose: purpose,
        metadata: JSON.stringify(iconImage),
        policy: convertPolicy,
      });
    } catch (error) {
      setResFailureData(error.message);
    }
  }

  const handleImageUpload = async (event) => {
    setIsLoadingImage(true);
    const file = event.target.files[0];
    console.log(file.size);
    setFilename(file.name);
    if (file) {
      const MAX_SIZE = 500 * 1024;
      if (file.size > MAX_SIZE) {
        setResFailureData(
          "The file size exceeds 500 KB. Please upload a smaller file.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(JSON.stringify(reader.result));
      };
      reader.readAsDataURL(file);
      setIsLoadingImage(false);
    }
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
      <NavbarComponent />
      <div className="main_profile">
        <div className="flex flex-col gap-1 items-center justify-center ">
          <div>
            <Card className="max-w-full shadow-lg">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Creating DAO</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <h4>
                  To create a DAO, you need 5.5 NEAR. Also you need to enter the
                  following parameters:
                </h4>
                <Input
                  className="mt-4"
                  autoFocus
                  label="Name for DAO"
                  placeholder="Enter name for DAO"
                  variant="bordered"
                  value={nameDAO}
                  onChange={(e) => setNameDAO(e.target.value)}
                />
                <Input
                  className="mt-5"
                  autoFocus
                  label="Purpose for DAO"
                  placeholder="Enter purpose for DAO"
                  variant="bordered"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                <Input
                  className="mt-5"
                  autoFocus
                  label="Council (Who will have all rights. Put ',' separated by a comma.)"
                  placeholder="Enter council"
                  variant="bordered"
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                />
                <h1 style={{ marginTop: 20 }}>Add image icon (optional)</h1>
                <div className={style.upload_container}>
                  <label className={style.upload_box}>
                    {isLoadingImage ? (
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
                  style={{ marginTop: 5 }}
                  text={"Create DAO"}
                  onClick={async () => {
                    await createDAO({
                      name: nameDAO,
                      purpose: purpose,
                      iconImage: imageBase64,
                      policy: policy,
                    });
                  }}
                />
              </CardBody>
            </Card>
          </div>
          <div>
            {resData ? (
              <h1
                className={
                  resData.status === Status.successful ? "" : "text-red"
                }
              >
                {atob(resData.data?.toString()) || "Absent data"}
              </h1>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

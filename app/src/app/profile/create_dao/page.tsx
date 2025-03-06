"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import { BlockChainResponse, DaoManagerJS, Status } from "dao-manager-js";
import LoadingSpinner from "../component/LoadingSpinner";
import { motion } from "framer-motion";

export default function CreateDao() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const daoManagerJS = DaoManagerJS.getInstance();

  const [resSuccessData, setResSuccessData] = useState<string | null>(null);
  const [resFailureData, setResFailureData] = useState<string | null>(null);

  const [DAOID, setDAOID] = useState<string | undefined>(undefined);
  const [nameDAO, setNameDAO] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);
  const [policy, setPolicy] = useState<string | undefined>(undefined);
  const [imageBase64, setImageBase64] = useState(null);
  const [resData, setResData] = useState<BlockChainResponse | undefined>(
    undefined,
  );
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  const [filename, setFilename] = useState<string | undefined>(undefined);

  const [connection, setConnection] = useState<boolean | null>(null);

  useEffect(() => {
    async function init(): Promise<void> {
      const connection = await ServiceDAO.checkAuth(router);
      setConnection(connection);
      useTransactionStatus(setResSuccessData, setResFailureData, searchParams);
      const daoID = localStorage.getItem(ConstantsDashboard.daoId);
      const userID = daoManagerJS.getAccountID();
      if (daoID) {
        setDAOID(daoID);
        setPolicy(userID);
      }
    }
    if (router) {
      const handle = setTimeout(() => {
        init();
      }, 0);

      return () => clearTimeout(handle);
    }
  }, [router]);

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
        metadata: JSON.stringify({ iconImage: iconImage }),
        policy: convertPolicy,
      });
    } catch (error) {
      setResFailureData(error.message);
    }
  }

  const handleImageUpload = async (event) => {
    setIsLoadingImage(true);
    const file = event.target.files[0];
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
        setResFailureData("FileReader result is not a string");
      }
    };
    reader.readAsDataURL(file);
    setIsLoadingImage(false);
  };

  if (connection == null) {
    return <LoadingSpinner />;
  }

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="main_profile"
      style={{ maxWidth: `${ConstantsDashboard.maxWidth}px`, width: "100%" }}
    >
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
              <h1 className="mt-4">Purpose for DAO</h1>
              <Input
                className="mt-1"
                autoFocus
                label="Name for DAO"
                placeholder="Enter name for DAO"
                variant="bordered"
                value={nameDAO}
                onChange={(e) => setNameDAO(e.target.value)}
              />
              <h1 className="mt-4">Purpose for DAO</h1>
              <Input
                className="mt-1"
                autoFocus
                placeholder="Enter purpose for DAO"
                variant="bordered"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              <h1 className="mt-4">Council. Who will have all rights</h1>
              <Input
                className="mt-1"
                autoFocus
                label="Put ',' separated by a comma"
                placeholder="Enter council"
                variant="bordered"
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
              />
              <h1 style={{ marginTop: 20 }}>
                Add image icon. Maximum size is 500kb.(optional)
              </h1>
              <div className={style.upload_container}>
                <label className={style.upload_box}>
                  {isLoadingImage == true ? (
                    <Spinner color="current" style={{ color: "black" }} />
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
                style={{ marginTop: "20px" }}
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
              className={resData.status === Status.successful ? "" : "text-red"}
            >
              {atob(resData.data?.toString()) || "Absent data"}
            </h1>
          ) : (
            ""
          )}
        </div>
      </div>
    </motion.div>
  );
}

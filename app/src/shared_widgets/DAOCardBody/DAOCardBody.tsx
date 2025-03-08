"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BlockChainResponse,
  DaoManagerJS,
  Status,
  Utils,
} from "dao-manager-js";
import {
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import ModelBounty from "src/app/profile/add_propose/components/modal_for_bounty";
import ModelPropose from "src/app/profile/component/modal_for_proposal";
import styles from "../../app/style/profile.module.css";

export interface DAOCardBodyProps {
  daoId?: string;
  type: "bounty" | "proposal";
}

export default function DAOCardBody({ daoId, type }: DAOCardBodyProps) {
  const [outputData, setOutputData] = useState(null);
  const [pageNumb, setPageNumb] = useState(1);
  const [startId, setStartId] = useState(0);
  const limit = 6;
  const [selectedModel, setSelectedModel] = useState<object>();

  const daoManagerJS = DaoManagerJS.getInstance();

  useEffect(() => {
    async function fetchData() {
      if (!daoId) return;

      const lastId = (
        type === "bounty"
          ? await daoManagerJS.getLastBountyId({ contractId: daoId })
          : await daoManagerJS.getLastProposalId({ contractId: daoId })
      ).data;
      setPageNumb(Math.floor((Number(lastId) - 1) / limit) + 1);
      await getDataPagination();
    }
    fetchData();
  }, [daoId]);

  async function getDataPagination(newStartId?: number) {
    if (!daoId) throw new Error("You must input DAO id");

    let res: BlockChainResponse;
    switch (type) {
      case "bounty":
        res = await daoManagerJS.getBounties({
          contractId: daoId,
          from_index: newStartId ?? startId,
          limit,
        });
        break;
      case "proposal":
        res = await daoManagerJS.getMultipleProposals({
          contractId: daoId,
          from_index: newStartId ?? startId,
          limit,
        });
    }
    if (res.status != Status.successful) {
      throw new Error(`Incorrect response: ${res.data}`);
    }

    const resData = res.data as Array<object>;
    const arrayWidgets = resData.map((item) => (
      <Card
        key={`${startId}-${item["id"]}`}
        isPressable
        shadow="md"
        style={{
          maxWidth: "500px",
          width: "100%",
          minWidth: "50px",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "#4b4f53",
        }}
        onPress={() => {
          setSelectedModel(item);
        }}
      >
        <CardHeader>
          <h1
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {item["description"]}
          </h1>
        </CardHeader>
        <CardBody>
          {type === "bounty" ? (
            <h1>Amount: {Utils.yoctoNEARToNear(item["amount"])} Near</h1>
          ) : (
            <>
              <h1
                style={{
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {item["proposer"]}
              </h1>
              <h1>{item["status"]}</h1>
              <h1>{Object.keys(item["kind"])[0]}</h1>
            </>
          )}
        </CardBody>
      </Card>
    ));

    setOutputData(arrayWidgets);
  }

  async function handlePagination(page) {
    const newStartId = (page - 1) * limit;
    setStartId(newStartId);
    await getDataPagination(newStartId);
  }

  if (selectedModel) {
    switch (type) {
      case "bounty":
        return (
          <ModelBounty
            daoID={daoId}
            data={selectedModel}
            onOpenChange={() => setSelectedModel(null)}
            isOpen={true}
          />
        );
      case "proposal":
        return (
          <ModelPropose
            daoID={daoId}
            data={selectedModel}
            onOpenChange={() => setSelectedModel(null)}
            isOpen={true}
          />
        );
    }
  }

  return (
    <CardBody>
      <div>
        {!daoId ? (
          <h1 style={{ margin: 20 }}>
            To see the {type}, you have to enter the DAO id
          </h1>
        ) : !outputData ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spinner
              label="Load data"
              color="current"
              style={{ color: "black" }}
            />
          </div>
        ) : outputData.length === 0 ? (
          <div style={{ margin: 20 }}>
            <h1>You don’t have any {type}.</h1>
            {type == "proposal" && (
              <h1>
                In order to make the first proposal, you need to go to the Add
                Proposal tab and select the appropriate proposal.
              </h1>
            )}
            {type == "bounty" && (
              <h1>
                To interact with bounty you need to first make a proposal to
                create bounty, then validate it.
              </h1>
            )}
          </div>
        ) : (
          <div
            style={{
              height: "auto",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              width: "100%",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={styles.cardGrid}
              key={startId}
            >
              {outputData}
            </motion.div>
            <div
              style={{
                marginTop: 15,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                showControls
                total={pageNumb}
                initialPage={1}
                onChange={handlePagination}
                color="success"
              />
            </div>
          </div>
        )}
      </div>
    </CardBody>
  );
}

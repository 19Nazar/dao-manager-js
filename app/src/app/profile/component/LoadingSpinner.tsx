import { Spinner } from "@nextui-org/react";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        width: "100%",
      }}
    >
      <Spinner
        label="Load page"
        size="lg"
        color="current"
        style={{ color: "black" }}
      />
    </div>
  );
};

export default LoadingSpinner;

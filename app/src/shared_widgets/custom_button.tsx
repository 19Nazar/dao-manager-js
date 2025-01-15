"use client";
import { Button } from "@nextui-org/react";

interface CustomButtonProps {
  text: string;
  onClick: () => Promise<void> | void;
  style?: React.CSSProperties;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  style,
}) => {
  return (
    <Button
      radius="full"
      className="customButton"
      style={style}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CustomButton;

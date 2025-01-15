import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";

export default function Provider({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

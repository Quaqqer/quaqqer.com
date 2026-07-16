"use client";

import { FC, useEffect, useState } from "react";

const NemuEmulator: FC = () => {
  const [component, setComponent] = useState<JSX.Element>();

  useEffect(() => {
    const loadNemu = async () => {
      const { Nemu } = await import("@quaqqer/nemu-react");
      setComponent(<Nemu />);
    };

    loadNemu();
  }, []);

  return component ?? "Loading Nemu...";
};

export default NemuEmulator;

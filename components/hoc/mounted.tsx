"use client";

import React, { FC, useEffect, useState } from "react";

const Mounted = (Component: FC<any>) => {
  const C = (props: any) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return <Component {...props} />;
  };
  C.displayName = `Mounted(${Component.displayName || Component.name})`;
  return C;
};

export default Mounted;

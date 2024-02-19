"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const OrganizationController = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;
    setActive({
      organization: params.organizationId as string,
    });
  }, [params.organizationId, setActive]);

  return null;
};

export default OrganizationController;

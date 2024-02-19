import React from "react";
import OrganizationController from "./_components/organization-controller";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs";

type Props = {
  children: React.ReactNode;
};

export const generateMetadata = async () => {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "Organization"),
  };
};

const OrganizationIdLayout = ({ children }: Props) => {
  return (
    <>
      <OrganizationController />
      {children}
    </>
  );
};

export default OrganizationIdLayout;

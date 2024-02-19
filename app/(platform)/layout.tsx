import CardModal from "@/components/modals/card-modal";
import ProModal from "@/components/modals/pro-modal";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@/providers/clerk-provider";
import QueryProvider from "@/providers/query-provider";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const PlatformLayout = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <CardModal />
        <ProModal />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;

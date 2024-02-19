import { checkSubscription } from "@/lib/subscription";
import React from "react";
import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "./_components/subscription-button";

type Props = {};

const BillingPage = async (props: Props) => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="w-full h-full flex justify-center">
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default BillingPage;

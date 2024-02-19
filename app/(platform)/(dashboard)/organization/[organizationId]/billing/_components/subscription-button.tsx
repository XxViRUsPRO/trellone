"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import React from "react";

type Props = {
  isPro: boolean;
};

export const SubscriptionButton = ({ isPro }: Props) => {
  const open = useProModal((state) => state.open);
  const { toast } = useToast();
  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error) => {
      toast.error({ description: error });
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      open();
    }
  };

  return (
    <Button variant="primary" disabled={loading} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Trellone Pro"}
    </Button>
  );
};

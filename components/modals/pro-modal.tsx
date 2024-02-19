"use client";

import Mounted from "@/components/hoc/mounted";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { useToast } from "../ui/use-toast";

type Props = {};

const ProModal = (props: Props) => {
  const { toast } = useToast();
  const isOpen = useProModal((state) => state.isOpen);
  const close = useProModal((state) => state.close);

  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (error) => {
      toast.error({ description: error });
    },
  });

  const onUpgrade = () => {
    execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative items-center justify-center overflow-hidden hidden [@media(min-height:650px)]:flex">
          <Image
            src="/logo.svg"
            alt="Pro Modal"
            fill
            className="object-contain p-2 mt-5"
          />
        </div>
        <div className="mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Trellone Pro Today!
          </h2>
          <p className="text-xs font-semibold">
            Enjoy unlimited access to all features and more!
          </p>
          <div className="pl-4">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Unlimited file storage</li>
              <li>Add unlimited team members</li>
              <li>Priority support</li>
              <li>And more...</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="primary" onClick={onUpgrade} disabled={loading}>
              Upgrade
            </Button>
            <Button onClick={close} disabled={loading}>
              No, thanks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Mounted(ProModal);

"use client";

import Mounted from "@/components/hoc/mounted";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { AuditLogWithUser } from "@/types";
import { Activity } from "./activity";

type Props = {};

const CardModal = (props: Props) => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const close = useCardModal((state) => state.close);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetch(`/api/cards/${id}`).then((res) => res.json()),
  });

  const { data: logData } = useQuery<AuditLogWithUser[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetch(`/api/cards/${id}/logs`).then((res) => res.json()),
  });

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!logData ? <Activity.Skeleton /> : <Activity data={logData} />}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Mounted(CardModal);

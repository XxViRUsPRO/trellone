"use client";

import { useCardModal } from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import React from "react";

type Props = {
  index: number;
  data: Card;
};

const CardItem = ({ index, data }: Props) => {
  const open = useCardModal((state) => state.open);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => open(data.id)}
          className="bg-white border-2 border-transparent hover:border-black px-3 py-2 text-sm truncate rounded-md shadow-sm"
        >
          {data.title}
        </li>
      )}
    </Draggable>
  );
};

export default CardItem;

"use client";

import React, { useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import ListHeader from "./list-header";
import CardForm from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";

type Props = {
  index: number;
  data: ListWithCards;
};

const ListItem = ({ data, index }: Props) => {
  const [editing, setEditing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const enterEditMode = () => {
    setEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const exitEditMode = () => {
    setEditing(false);
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-64 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md shadow-md pb-2 bg-light"
          >
            <ListHeader onAddCard={enterEditMode} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 && "mt-2"
                  )}
                >
                  {data.cards.map((card, idx) => (
                    <CardItem key={card.id} index={idx} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textAreaRef}
              listId={data.id}
              editing={editing}
              enterEditMode={enterEditMode}
              exitEditMode={exitEditMode}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;

"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import ListItem from "./list-item";
import { useToast } from "@/components/ui/use-toast";
import { updateCardOrder } from "@/actions/update-card-order";

type Props = {
  boardId: string;
  data: ListWithCards[];
};

const reorder = <T,>(items: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ListContainer = ({ boardId, data }: Props) => {
  const [orderedData, setOrderedData] = useState<ListWithCards[]>(data);
  const { toast } = useToast();
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success({ description: "List order updated" });
    },
    onError: (error) => {
      toast.error({
        description: error,
      });
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success({ description: "Card order updated" });
    },
    onError: (error) => {
      toast.error({
        description: error,
      });
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    // If the user dropped the card in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // If the user dragged a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (list, idx) => ({
          ...list,
          order: idx,
        })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // If the user dragged a card
    if (type === "card") {
      let items = [...orderedData];

      // Lists
      const sourceList = items.find((list) => list.id === source.droppableId);
      const destinationList = items.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // Make that both lists have attribute "cards" defined
      sourceList.cards = sourceList.cards || [];
      destinationList.cards = destinationList.cards || [];

      // Case 1: The user dragged a card in the same list
      if (source.droppableId === destination.droppableId) {
        const newCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        newCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = newCards;

        setOrderedData(items);
        executeUpdateCardOrder({ items: newCards, boardId });
      } else {
        // Case 2: The user dragged a card to a different list
        const [moved] = sourceList.cards.splice(source.index, 1);

        moved.listId = destinationList.id;

        destinationList.cards.splice(destination.index, 0, moved);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(items);
        executeUpdateCardOrder({ items: destinationList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list) => (
              <ListItem key={list.id} data={list} index={list.order} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;

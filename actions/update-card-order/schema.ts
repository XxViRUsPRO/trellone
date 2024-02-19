import { z } from "zod";

export const UpdateCardOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z
        .string({
          required_error: "Title is required",
          invalid_type_error: "Title must be a string",
        })
        .min(3, "Title is too short"),
      order: z.number().min(0, "Order must be a positive number").int(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  boardId: z.string(),
});

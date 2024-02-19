import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";

export type DataType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<DataType, Card>;

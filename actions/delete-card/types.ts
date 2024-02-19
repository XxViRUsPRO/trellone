import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";

export type DataType = z.infer<typeof DeleteCard>;
export type ReturnType = ActionState<DataType, Card>;

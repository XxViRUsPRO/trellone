import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";

export type DataType = z.infer<typeof CopyCard>;
export type ReturnType = ActionState<DataType, Card>;

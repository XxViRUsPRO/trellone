import { z } from "zod";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";

export type DataType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<DataType, List>;

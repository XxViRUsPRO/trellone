import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

export type DataType = z.infer<typeof UpdateBoard>;
export type ReturnType = ActionState<DataType, Board>;

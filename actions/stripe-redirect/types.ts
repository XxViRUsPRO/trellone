import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";

export type DataType = z.infer<typeof StripeRedirect>;
export type ReturnType = ActionState<DataType, string>;


import { ExecutionPhase } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";

type Phase = Pick<ExecutionPhase, "creditsCost">;

export function getPhasesTotalCost(
    phases : Phase[]

)
{

    return phases.reduce((acc, phase) => (phase.creditsCost || 0) + acc, 0);

}
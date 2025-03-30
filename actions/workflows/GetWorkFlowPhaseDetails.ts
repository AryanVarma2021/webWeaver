"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflowPhaseDetails( phaseId:string) {   

    const {userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated")
    }

    return await prisma.executionPhase.findUnique({
        where : {
            id:phaseId,
            execution : {
                userId,
            }
        },
    })

}
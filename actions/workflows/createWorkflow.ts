"use server"

import prisma from "@/lib/prisma"
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"



export async function CreateWorkflow(form : CreateWorkflowSchemaType) {
    // Create a new workflow


    // Validate the form
    const validation = createWorkflowSchema.safeParse(form)
    if (!validation.success) {
        throw new Error(validation.error.message + "error at validation")
    }

    const {userId} = await auth()

    if(!userId) {
        throw new Error("User not found")
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: "TODO",
            name: validation.data.name,
            description: validation.data.description ?? "",
        },
    });


    if(!result) {
        throw new Error("Failed to create workflow");
    }


    return redirect(`/workflows/editor/${result.id}`)

    
    

}
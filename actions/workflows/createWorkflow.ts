"use server"

import prisma from "@/lib/prisma"
import { CreateflowNode } from "@/lib/workflow/createflowNode"
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow"
import { AppNode } from "@/types/appNode"
import { Tasktype } from "@/types/Tasktype"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { Edge } from "@xyflow/react"
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

    const initialFlow : {nodes : AppNode[], edges:Edge[]} = {
        nodes : [],
        edges : []
    };

    initialFlow.nodes.push(CreateflowNode(Tasktype.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: JSON.stringify(initialFlow),
            name: validation.data.name,
            description: validation.data.description ?? "",
        },  
    });


    if(!result) {
        throw new Error("Failed to create workflow");
    }


     redirect(`/workflows/editor/${result.id}`)

    
    

}
"use server"

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server"
import {ExecuteWorkflow}from "@/lib/workflow/ExecuteWorkflow"
import { redirect } from "next/navigation";

export async function runWorkflow(form : {workflowId : string, flowDefinition?:string }) {


    const {userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated")
    }
    const { workflowId, flowDefinition } = form;
    if(!workflowId) {
        throw new Error("Workflow ID not provided")
    }
    

    const workflow = await prisma.workflow.findUnique({
        where : {
            userId,
            id : workflowId,
        },
    });

    if(!workflow) {
        throw new Error("Workflow not found")
    }

    let executionPlan : WorkflowExecutionPlan;
    if(!flowDefinition) {
        throw new Error("Flow definition not provided")
    }

    const flow = JSON.parse(flowDefinition);
   
    
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    
    

    if(result.error) {
        throw new Error("Error generating execution plan")
    }

    if(!result.executionPlan) {
        throw new Error("Execution plan not found")
    }

    executionPlan = result.executionPlan;


    const execution = await prisma.workflowExecution.create({
        data : {
            workflowId,
            status : WorkflowExecutionStatus.PENDING,
            userId,
            startedAt : new Date(),
            trigger : WorkflowExecutionTrigger.MANUAL,
            phases : {
                create : executionPlan.flatMap(phase =>{
                    return phase.nodes.flatMap(node => {
                        return {
                            userId,
                            status : ExecutionStatus.CREATED,
                            number : phase.phase,
                            node : JSON.stringify(node),
                            name : TaskRegistry[node.data.type].labbel,

                        }
                    })
                })

        
            },
        },
        select : {
            id : true,
            phases : true
        },
    });


    if(!execution) {
        throw new Error("Error creating workflow execution")
    }


    ExecuteWorkflow(execution.id);

    redirect(`/workflow/runs/${workflowId}/${execution.id}`)
   
    


}


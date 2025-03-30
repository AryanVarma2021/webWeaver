import {LucideProps} from "lucide-react"
import { TaskParam, Tasktype } from "./Tasktype"
import { AppNode } from "./appNode"
import { Exo } from "next/font/google"

export enum WorkflowStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    
}

export type WorkflowTask = {
    labbel : string,
    Icon : React.FC<LucideProps>
    type:Tasktype,
    isEntryPoint?:boolean,
    inputs: TaskParam[],
    outputs: TaskParam[],
    credits : number

}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];
export type WorkflowExecutionPlanPhase = {
    phase:number,
    nodes : AppNode[],
}

export enum WorkflowExecutionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum ExecutionStatus {
    CREATED = 'CREATED',
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum WorkflowExecutionTrigger {
    MANUAL = 'MANUAL',
}
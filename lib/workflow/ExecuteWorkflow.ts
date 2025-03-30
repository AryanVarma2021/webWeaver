import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecuteRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { env } from "process";
import { TaskParamType } from "@/types/Tasktype";
import { Browser, Page } from "puppeteer";

export async function ExecuteWorkflow( executionId:string) {
   

    
    const execution = await prisma.workflowExecution.findUnique({
        where : {
            id : executionId,
        },
        include : {
            workflow:true,
            phases:true
        },  
    })

    if(!execution) {
        throw new Error("Execution not found")
    }



    const environment:Environment = {
        phases : {
            

        }
    }

    
    
    await  initializeWorkflowExecution(executionId, execution.workflowId);
    await initialPhaseStatuses(execution);




    let executionFail = false;
    let creditConsumed = 0;

    for(const phase of execution.phases) {
        await waitFor(3000)
        const phaseExecution = await executionWorkflowPhase(phase, environment)
        
        
        if(!phaseExecution.success) {
            executionFail = true;
            break;
        }
        
    }


    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFail, creditConsumed);





    
    

    await cleanUpenvironment(environment);





    revalidatePath("/workflow/runs")

}

async function initializeWorkflowExecution(executionId:string, workflowId:string) {

    await prisma.workflowExecution.update({
        where : {
            id : executionId,
        },
        data : {
            status : WorkflowExecutionStatus.RUNNING,
            startedAt : new Date(),
        },
    });


    await prisma.workflow.update({
        where : {
            id : workflowId,
        },
        data : {
            lastRunAt : new Date(),
            
            lastRunStatus : WorkflowExecutionStatus.RUNNING,
            lastRunId : executionId,

        },
    })

}

async function initialPhaseStatuses(execution : any) {
    await prisma.executionPhase.updateMany({
        where : {
            id: {
                in : execution.phases.map((phase:any) => phase.id), 
            },
        },
        data : {
            status : WorkflowExecutionStatus.PENDING,
           
        },
    })
}

async function finalizeWorkflowExecution(
    executionId : string,
    workflowId : string,
    executionFail : boolean,
    creditConsumed : number,
)
{

    const finalStatus = executionFail ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;


    await prisma.workflowExecution.update({
        where : {
            id : executionId,
        },
    data : {
            status : finalStatus,
            completedAt : new Date(),
            creditsConsumed : creditConsumed,
        },
    });


    await prisma.workflow.update({
        where : {
            id : workflowId,
            lastRunId:executionId,
        },
        data : {
            lastRunStatus : finalStatus,
        },
    }).catch((err)=>{
        console.log("Error updating workflow", err)
    })

 }


 async function executionWorkflowPhase(phase : ExecutionPhase, environment : Environment) {

    const startAt = new Date();
    const node= JSON.parse(phase.node) as AppNode;
    
    
    setupEnvironment(node, environment)

    await prisma.executionPhase.update({

        where : {
            id : phase.id,
        },
        data : {
            status : ExecutionStatus.RUNNING,
            startedAt : startAt,
            inputs : JSON.stringify(environment.phases[node.id].inputs),
        },
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    


   const success = await executePhase(phase, environment, node)
    

    const outputs = environment.phases[node.id].outputs;
    
    
    
    await finalizePhase(phase.id, success, outputs);
    return {success}
    



 }


 async function finalizePhase(phaseId:string, success:boolean, outputs:any) {

    const finalStatus = success ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED;
    

    await prisma.executionPhase.update({
        where : {
            id : phaseId,
        },
        data : {
            status : finalStatus,
            completedAt : new Date(),
            outputs : JSON.stringify(outputs),
        },
    }).catch((err)=>{
        console.log("Error updating phase", err)
    })


 }


 async function executePhase(phase : ExecutionPhase, environemnt : Environment, node : AppNode):Promise<boolean> {


    const runfn = ExecuteRegistry[node.data.type];

    //console.log("runfn and function", runfn, ExecuteRegistry[node.data.type]);
    
    

    if(!runfn) {
        return false;
    }


    const executionEnvironment : ExecutionEnvironment<any> = createExecutionEnvironment(node, environemnt)
    

    const r =  await runfn(executionEnvironment);
    
    return r;
    

 }

 function setupEnvironment(node : AppNode, environment : Environment) {

    environment.phases[node.id] = {
        inputs : {},
        outputs : {}
    }

    const inputs = TaskRegistry[node.data.type].inputs;
    
    

    for(const input of inputs) {
        if(input.type == TaskParamType.BROWSER_INSTANCE) {
            continue;
        }
        const inputValue = node.data.inputs[input.name];
        if(inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }





    }
    
    


 }


 function createExecutionEnvironment(node : AppNode, environment : Environment):ExecutionEnvironment<any> {


    const executionEnvironment : ExecutionEnvironment<any> = {
        getInput : (name:string) => {
            return environment.phases[node.id].inputs[name]
        },
        setOutputs : (name:string, value:string) => {
            environment.phases[node.id].outputs[name] = value;
        },

        getBrowser : ()=>  environment.browser ,
        
        setBrowser : (browser : Browser) => {
            environment.browser = browser;
        },
        getPage : ()=> environment.page,
        setPage : (page : Page) => {
            environment.page = page;
        },
    }

    return executionEnvironment;
 }



 async function cleanUpenvironment(environment : Environment) {


    if(environment.browser) {
        await environment.browser.close().catch((err)=>console.log("Error closing browser", err)
        )
    }
    




 }

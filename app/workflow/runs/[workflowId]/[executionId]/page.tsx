import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionwithPhases";
import TopBar from "@/app/workflow/_components/topbar/TopBar";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

function ExecutionViewPage({params} :{
    params : {
        workflowId : string;
        executionId : string;
    }
} ) {
    return (
        <div className="flex flex-col h-screen overflow-hidden ">
            <TopBar workflowId={params.workflowId} title="Workflow details" subTitle={`Run id : ${params.executionId}`} hideButtons/>

            <section className="flex h-full overflow-auto">
                <Suspense fallback={
                    <div className="flex w-full items-center justify-center ">
                        <Loader2Icon className="h-10 w-10 animate-spin stroke-primary"/>
                    </div>
                }>
                    <ExecutionViewWrapper executionId={params.executionId}/>
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionViewWrapper({executionId} : {executionId:string}) {

const {userId} = await auth();

const workflowExecution =await GetWorkflowExecutionWithPhases(executionId);

if(!workflowExecution) {
    return <div className="flex w-full items-center justify-center">Workflow execution not found</div>
}
    return (
       
        <ExecutionViewer initialData={workflowExecution}/>
    )
}

export default ExecutionViewPage  
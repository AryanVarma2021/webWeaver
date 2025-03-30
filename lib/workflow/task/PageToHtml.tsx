import { TaskParamType, Tasktype } from "@/types/Tasktype";
import { WorkflowTask } from "@/types/workflow";
import {CodeIcon, GlobeIcon, LucideProps} from 'lucide-react'
export const PageToHtml = {
    type : Tasktype.PAGE_TO_HTML,
    labbel : "Get HTML from page",
    Icon : (props : LucideProps) => (<CodeIcon className="stroke-rose-400" {...props}/>),

    isEntryPoint : false,
    credits : 1,

    inputs : [
        {
            name : 'Web Page', 
            type : TaskParamType.BROWSER_INSTANCE,
            
            required : true,
            

        },
    ] as const,
    outputs : [
        {
            name : 'HTML', 
            type : TaskParamType.STRING,
            
        },
        {
            name : "Web page",
            type : TaskParamType.BROWSER_INSTANCE,
        }


    ] as const

} satisfies WorkflowTask;
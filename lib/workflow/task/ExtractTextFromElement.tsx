import { TaskParamType, Tasktype } from "@/types/Tasktype";
import { WorkflowTask } from "@/types/workflow";
import {CodeIcon, GlobeIcon, LucideProps, TextIcon} from 'lucide-react'
export const ExtractTextFromElement = {
    type : Tasktype.EXTRACT_TEXT_FROM_ELEMENT,
    labbel : "Extract text from elemnt",
    Icon : (props : LucideProps) => (<TextIcon className="stroke-rose-400" {...props}/>),

    isEntryPoint : false,
    credits : 1,

    inputs : [
        {
            name : 'Html', 
            type : TaskParamType.STRING,
            
            required : true,
            

        },
        {
            name : "Selector",
            type : TaskParamType.STRING,
            required : true,
        }
    ] as const ,
    outputs : [
        
        {
            name : "Extracted Text",
            type : TaskParamType.STRING,
        }


    ] as const 

} satisfies WorkflowTask;
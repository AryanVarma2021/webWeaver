import { TaskParamType, Tasktype } from "@/types/Tasktype";
import {CodeIcon, GlobeIcon, LucideProps} from 'lucide-react'
export const PageToHtml = {
    type : Tasktype.PAGE_TO_HTML,
    labbel : "Get HTML from page",
    Icon : (props : LucideProps) => (<CodeIcon className="stroke-rose-400" {...props}/>),

    isEntryPoint : false,

    inputs : [
        {
            name : 'Web Page', 
            type : TaskParamType.BROWSER_INSTANCE,
            
            required : true,
            

        },
    ],
    outputs : [
        {
            name : 'HTML', 
            type : TaskParamType.STRING,
            
        },
        {
            name : "Web page",
            type : TaskParamType.BROWSER_INSTANCE,
        }


    ]

}
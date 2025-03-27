import { TaskParamType, Tasktype } from "@/types/Tasktype";
import {GlobeIcon, LucideProps} from 'lucide-react'
export const LaunchBrowserTask = {
    type : Tasktype.LAUNCH_BROWSER,
    labbel : "Launch browser",
    Icon : (props : LucideProps) => (<GlobeIcon className="stroke-pink-400" {...props}/>),

    isEntryPoint : true,

    inputs : [
        {
            name : 'Website URL', 
            type : TaskParamType.STRING,
            helperText : "eg : www.google.com",
            required : true,
            hideHandlr : true

        },
    ],
    outputs : [
        {
            name : 'Web Page', 
            type : TaskParamType.BROWSER_INSTANCE,
            

        },

    ]

}
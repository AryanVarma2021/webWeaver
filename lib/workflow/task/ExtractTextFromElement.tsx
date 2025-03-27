import { TaskParamType, Tasktype } from "@/types/Tasktype";
import {CodeIcon, GlobeIcon, LucideProps, TextIcon} from 'lucide-react'
export const ExtractTextFromElement = {
    type : Tasktype.EXTRACT_TEXT_FROM_ELEMENT,
    labbel : "Extract text from elemnt",
    Icon : (props : LucideProps) => (<TextIcon className="stroke-rose-400" {...props}/>),

    isEntryPoint : false,

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
    ],
    outputs : [
        
        {
            name : "Extracted Text",
            type : TaskParamType.STRING,
        }


    ]

}
"use client"

import { cn } from "@/lib/utils"
import { TaskParam } from "@/types/Tasktype"
import { Handle, Position } from "@xyflow/react"
import { ColorForHnandle } from "./common"

export function NodeOutputs({children}:{children:React.ReactNode}) {
    return (
        <div className="flex flex-col divide-y gap-2 p-2 ">
            {children}
        </div>
    )
}
export function NodeOutput({output, nodeId}:{output: TaskParam, nodeId:string}) {
    return (
        <div className="flex justify-end relative p-3 bg-secondary  ">
            <p className="text-xs text-muted-foreground ">{output.name}</p>
            <Handle
             id={output.name} type="source" position={Position.Right}className= {cn("!bg-muted-foreground !border-2 !border-backgtound !-right-2 !w-4 !h-4 ", ColorForHnandle[output.type])}/>
        </div>
    )


}
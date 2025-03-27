import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/Tasktype";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";

export function NodeInputs ({children} : {children:ReactNode}) {
    return (
        <div className="flex flex-col divide-y gap-2">
            {children}
        </div>
    );
}

export function NodeInput ({input, nodeId} : {input:TaskParam, nodeId:string}) {
    return (
        <div className="flex justify-start relative p-3 bg-secondary w-full">
            <NodeParamField nodeId={nodeId} param={input}/>
            {!input.hideHandle && (
                <Handle
                className={cn("!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4 ")}
                
                id={input.name} type="target" position={Position.Left}/>

            )}
            
        </div>
    );
}
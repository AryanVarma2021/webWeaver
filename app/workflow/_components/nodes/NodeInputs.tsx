import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/Tasktype";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import useFlowValidation from "@/components/hooks/useFlowValidation";

export function NodeInputs ({children} : {children:ReactNode}) {
    return (
        <div className="flex flex-col divide-y gap-2">
            {children}
        </div>
    );
}

export function NodeInput ({input, nodeId} : {input:TaskParam, nodeId:string}) {

    const edges = useEdges();
    const {invalidInputs} = useFlowValidation()
    const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);

    const hasErrors = invalidInputs.find(node => node.nodeId === nodeId)?.inputs.find(invalidInput => invalidInput === input.name )




    return (
        <div className={cn("flex justify-start relative p-3 bg-secondary w-full", hasErrors && "bg-destructive")}>
            <NodeParamField nodeId={nodeId} param={input}/>
            {!input.hideHandle && (
                <Handle
                className={cn("!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4 ")}
               // isConnectable={isConnected}
                
                id={input.name} type="target" position={Position.Left}/>

            )}
            
        </div>
    );
}
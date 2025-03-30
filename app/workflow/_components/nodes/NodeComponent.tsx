"use client"
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";

import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";


const DEV_MODE = process.env.NEXT_PUBLIC_IC_DEV_MODE === "true"
const NodeComponent = memo((props:NodeProps)=> {
    const nodeData = props.data as AppNodeData
    const task = TaskRegistry[nodeData.type]

    return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
        {DEV_MODE && <Badge>DEV : {props.id}</Badge>}
        <NodeHeader nodeId={props.id} tasktype={nodeData.type} />
        <NodeInputs>
            {task.inputs.map(input => (
                <NodeInput nodeId={props.id} key={input.name} input={input}/>
            ))}
        </NodeInputs>
        <NodeOutputs>
            {task.outputs.map(output => (
                <NodeOutput nodeId={props.id} key={output.name} output={output}/>
            ))}
        </NodeOutputs>
        
        </NodeCard>
});


export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
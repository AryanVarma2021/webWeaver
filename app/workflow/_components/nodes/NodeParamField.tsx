import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/Tasktype";
import StringParam from "./StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import BrowserInstanceParam from "./param/BrowserInstanceParam";

function NodeParamField ({param, nodeId} : {param : TaskParam, nodeId:string}) {
    const {updateNodeData, getNode} = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name];

    const updateNodeParamValue = useCallback((newValue:string)=>{
        updateNodeData(nodeId, {
            inputs : {
                ...node?.data.inputs,
                [param.name] : newValue,
            }
        })

        console.log(value);
        


    }, [updateNodeData, param.name, node?.data.inputs ])

    switch (param.type) {
        case TaskParamType.STRING:
            return <StringParam value={value} updateNodeParamValue={updateNodeParamValue} param={param}/>
            
            break;
        
            case TaskParamType.BROWSER_INSTANCE :
                return <BrowserInstanceParam value={""} updateNodeParamValue={updateNodeParamValue} param={param}/>


            break;
    
        default:
            <div className="w-full ">
                <p className="text-xs text-muted-foreground  ">Not implemented</p>
            </div>
            break;
    }
}


export default NodeParamField
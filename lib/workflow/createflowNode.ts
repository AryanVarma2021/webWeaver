import { AppNode } from "@/types/appNode";
import { Tasktype } from "@/types/Tasktype";



export function CreateflowNode(
    nodeType : Tasktype,
    position? : {x : number, y : number}

): AppNode {
    return {
        id : crypto.randomUUID(),
        type : "WebWeaverNode",
        dragHandle : ".drag-handle",
        data : {
            type : nodeType,
            inputs : {}
        },
        position : position ?? {x:0, y:0}
    }
}
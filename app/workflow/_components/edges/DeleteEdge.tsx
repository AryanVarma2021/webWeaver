"use client"

import { Button } from "@/components/ui/button";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, Position, useReactFlow } from "@xyflow/react";


export default function DeleteEdge(props : EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath(props)

    const {setEdges} = useReactFlow();


    return (
   <>
   <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style}/>
        Hello
   <EdgeLabelRenderer>
    <div
        style={{
            position: "absolute",
            transform : `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`  ,
            pointerEvents : "all"
        }}
    >
        <Button variant={"outline"} size={"icon"} className="w-5 cursor-pointer rounded-full text-xs leading-none hover:shadow-lg  h-5 border" 
        onClick={()=>{
            setEdges(edges => edges.filter((edge) => edge.id !== props.id))

        }}
        
        >
            X
         
        </Button>

    </div>
   </EdgeLabelRenderer>
   
   </>
    )

}
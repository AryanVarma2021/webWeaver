"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateflowNode } from '@/lib/workflow/createflowNode'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { AppNode } from '@/types/appNode'
import { Tasktype } from '@/types/Tasktype'
import { useReactFlow } from '@xyflow/react'
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from 'lucide-react'
import { Butterfly_Kids } from 'next/font/google'
import React from 'react'

const NodeHeader = ({tasktype, nodeId} : {nodeId:string, tasktype : Tasktype}) => {
    const task = TaskRegistry[tasktype]
    const {deleteElements, getNode,addNodes} = useReactFlow();
  return (
    <div className='flex items-center gap-2 p-2'>
        <task.Icon size={16}/>
        <div className="flex justify-between items-center w-full">
            <p className='text-xs font-bold uppercase text-muted-foreground'>
                {task.labbel}
            </p>
            <div className="flex gap-1 items-center">
                {task.isEntryPoint && <Badge >Enter point</Badge>}
                <Badge className='gap-2 flex items-center text-xs'>
                    <CoinsIcon size={16}/>
                    {task.credits}
                </Badge>
                {!task.isEntryPoint && (
                    <>
                    <Button
                    onClick={()=>{
                        deleteElements({nodes: [{id:nodeId}]})
                    }}
                    variant={'ghost'} size={"icon"} className='cursor-pointer'>
                        <TrashIcon size={16}/>
                    </Button>
                    <Button
                    onClick={()=>{
                        console.log("CLICK");
                        
                        const node = getNode(nodeId) as AppNode
                        const newX = node.position.x ;
                        const newY = node.position.y + node.measured?.height! + 20;
                        const newNode = CreateflowNode(node.data.type, {x:newX, y:newY});
                        addNodes([newNode])
                        console.log(newNode);
                        
                    }}
                    
                    variant={'ghost'} size={"icon"} className='cursor-pointer'>
                        <CopyIcon size={16}/>
                    </Button>
                    </>
                )}
                <Button
                
                
                variant={'ghost'} size={"icon"} className='drag-handle cursor-grab'>
                    <GripVerticalIcon size={20}/>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default NodeHeader
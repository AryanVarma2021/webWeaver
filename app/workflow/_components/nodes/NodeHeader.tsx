"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { Tasktype } from '@/types/Tasktype'
import { CoinsIcon, GripVerticalIcon } from 'lucide-react'
import { Butterfly_Kids } from 'next/font/google'
import React from 'react'

const NodeHeader = ({tasktype} : {tasktype : Tasktype}) => {
    const task = TaskRegistry[tasktype]
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
                    TODO
                </Badge>
                <Button variant={'ghost'} size={"icon"} className='drag-handle cursor-grab'>
                    <GripVerticalIcon size={20}/>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default NodeHeader
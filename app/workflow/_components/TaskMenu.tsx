"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { Tasktype } from '@/types/Tasktype';
import React from 'react'

const TaskMenu = () => {
  return (
    <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 h-full px-4 overflow-auto '>
        <Accordion type='multiple' className='w-full' defaultValue={["extration"]}  >
            <AccordionItem value='extraction'>
                <AccordionTrigger className='font-bold'>Extraction</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-1 '>
                    <TaskMenuBtn taskType={Tasktype.PAGE_TO_HTML}/>
                    <TaskMenuBtn taskType={Tasktype.EXTRACT_TEXT_FROM_ELEMENT}/>

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </aside>
  )
}

function TaskMenuBtn({taskType} : {taskType : Tasktype}) {
    
    
    const task = TaskRegistry[taskType];

    const ondragstart = (e : React.DragEvent, taskType : Tasktype) => {
        e.dataTransfer.setData("application/reactflow", taskType)
        e.dataTransfer.effectAllowed = "move"
    }

    return <Button variant='secondary' 
    draggable
    onDragStart={(e) => {
        ondragstart(e, taskType)
    }}

                   className='flex justify-between items-center gap-2 border w-full' 
    
    >
        <div className="flex gap-2 ">
        <task.Icon size={20}/>
        {task.labbel}
        </div>
    </Button>
}


export default TaskMenu
"use client";

import { runWorkflow } from '@/actions/workflows/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const ExcuteBtn = ({workflowId} : {workflowId:string}) => {
    const generate = useExecutionPlan();
    const {toObject} = useReactFlow();
    const mutation = useMutation({
        mutationFn : runWorkflow,
        onSuccess : (data) => {
            toast.success("Workflow execution started")
        },
        onError : (error) => {
            toast.error("Error executing workflow")
        }
    })
  return (
    <Button 
    disabled={mutation.isPending}
    onClick={()=>{
        const plan = generate();
        if(!plan) {
            toast.error("Error generating execution plan")
            return;
        }
        mutation.mutate({
            workflowId,
            flowDefinition : JSON.stringify(toObject())
        })
        
    }}
    variant={"outline"}
    
    className='flex items-center gap-2'>
 Execute
        <PlayIcon className='stroke-orange-400' size={16}/>

       

    </Button>
  )
}

export default ExcuteBtn
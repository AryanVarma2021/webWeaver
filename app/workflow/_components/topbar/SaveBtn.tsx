"use client";

import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

export default function SaveBtn ({workflowId}:{workflowId:string}) {
    const {toObject} = useReactFlow();
    const saveMutation = useMutation({
        mutationFn : UpdateWorkflow,
        onSuccess : ()=>{
            
            toast.success("Flow saved successfully");
        },
        onError : ()=> {
            toast.error("Something went wrong");
        }
    })
  return (
    <Button 
    disabled={saveMutation.isPending}
    className='flex items-center gap-2'
    onClick={async()=>{
        //console.log("Flow", toObject(), workflowId); 
        const workflowDefinition = JSON.stringify(toObject()) ;
        const toastId = toast.loading("Saving...")
        saveMutation.mutate({
            id:workflowId,
            definition : workflowDefinition
        }, {
            onSuccess : ()=> toast.dismiss(toastId),
            onError : ()=> toast.dismiss(toastId),

        })

        

        
        
        
    }}
    variant={"outline"} 
    
    >
        <CheckIcon size={16} className='stroke-green-400'/>

        
        
        Save
        </Button>
  )
}


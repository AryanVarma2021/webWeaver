"use client";

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import SaveBtn from './SaveBtn';
import ExcuteBtn from './ExcuteBtn';

interface Props {
    title:string;
    subTitle?:string;
    workflowId : string;
    hideButtons?: boolean;
}

const TopBar = ({title, subTitle, workflowId, hideButtons=false} : Props) => {
    const router = useRouter()
  return (
    <header className='flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10 '>
        <div className="flex gap-1 flex-1">
            <TooltipWrapper content="Back">
                <Button 
                size={"icon"}
                variant={"ghost"}
                onClick={()=>router.back()}>
                    <ChevronLeftIcon size={20}/>
                    
                </Button>
               
            </TooltipWrapper>
            <div className="">
                <p className='font-bold text-ellipsis truncate'>{title}</p>
                    {subTitle && (
                        <p className='text-xs text-muted-foreground truncate'>{subTitle}</p>
                    )}
                
            </div>
        </div>
        <div className="flex gap-1 flex-1 justify-end">
           {!hideButtons && (
             <>
             <SaveBtn workflowId={workflowId}/>
             <ExcuteBtn workflowId={workflowId}/>
             </>
           )}
        </div>
    </header>
  )
}

export default TopBar
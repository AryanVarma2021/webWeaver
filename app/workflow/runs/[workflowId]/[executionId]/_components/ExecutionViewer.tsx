"use client"
import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/GetWorkflowExecutionwithPhases'
import { getWorkflowPhaseDetails } from '@/actions/workflows/GetWorkFlowPhaseDetails'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DatesToDurationString } from '@/lib/helper/Dates'
import { getPhasesTotalCost } from '@/lib/helper/phases'
import { waitFor } from '@/lib/helper/waitFor'
import { WorkflowExecutionStatus } from '@/types/workflow'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { CalendarIcon, CircleDashedIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react'
import React, { ReactNode } from 'react'

type ExecutionData = Awaited< ReturnType<typeof GetWorkflowExecutionWithPhases>>

const ExecutionViewer = ({initialData}:{initialData:ExecutionData}) => {

    
    
    const [selectedPhase, setSelectedPhase] = React.useState<string | null>(null);
    
    
    const query = useQuery(
        {
            queryKey : ["workflowExecution", initialData?.id],
            initialData,
            queryFn : ()=>GetWorkflowExecutionWithPhases(initialData!.id),
            refetchInterval : (query)=>query.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,


        }
    )

    
    


    const duration = DatesToDurationString(query.data?.completedAt, query.data?.startedAt) ;


    const creditsConsumed = getPhasesTotalCost(query.data?.phases || []);


    const phaseDetails = useQuery({
        queryKey : ["phaseDetails", selectedPhase],
        enabled : selectedPhase !== null,
        queryFn : async () => getWorkflowPhaseDetails(selectedPhase as string)
    })
    
    






  return (
    <div className='flex w-full h-full'>
        <aside className='w-[440px] min-w-[440px]  max-w-[440px] border-separate  border-r-2 flex flex-grow flex-col overflow-hidden '>
            <div className="py-4 px-2">
                <ExecuteLabel Icon={CircleDashedIcon} label={"Status"} value={query.data?.status}/>

                <ExecuteLabel Icon={CalendarIcon} label={"Started At"} value={
                    query.data?.createdAt ? formatDistanceToNow(new Date(query.data.createdAt), {addSuffix:true}) : "N/A"

                }/>

<ExecuteLabel Icon={CircleDashedIcon} label={"Duration"} value={duration ? duration : <Loader2Icon className='animate-spin' size={20}/>}/>
<ExecuteLabel Icon={CircleDashedIcon} label={"Credits Consumed"} value={creditsConsumed}/>
                

                
            </div>
            <Separator/>
            <div className="flex justify-center items-center py-2 px-4 text-xs">
                <div className="text-muted-foreground flex items-center gap-2  ">
                    <WorkflowIcon size={20} className='stroke-muted-foreground/80 '/>
                    <span className='font-semibold'>Phases</span>
                </div>
            </div>

            <Separator/>
            <div className="overflow-auto h-full px-2 py-2">
                {query.data?.phases.map((phase, index) => (
                   <Button
                   onClick={()=>{
                    setSelectedPhase(phase.id)
                   }}
                   
                   variant={selectedPhase === phase.id ? "secondary":"ghost"} className='w-full justify-between ' key={phase.id}>
                    <div className="flex items-center gap-2">
                        <Badge variant={"outline"} className='text-xs'>{index+1}</Badge>
                    <p className='font-semibold '>
                        {phase.name}
                    </p>
                    </div>
                    <p className='text-xs text-muted-foreground '>{phase.status}</p>
                   </Button>
                ))}

            </div>

        </aside>
        <div className="flex w-full h-full">
            {JSON.stringify(phaseDetails.data, null, 4)}
           
        </div>
    </div>
  )
}

function ExecuteLabel ({Icon, label, value} : {
    Icon : LucideIcon,
    label : ReactNode,
    value : ReactNode
}) {
    return (
        <div className="flex justify-between items-center py-2 px-4 text-xs ">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <Icon size={20} className='stroke-muted-foreground/80 '/>
                        <span>{label}</span>
                    </div>

                    <div className="font-semibold capitalize flex  gap-2 items-center">
                       {value}
                    </div>
                </div>
    )

}

export default ExecutionViewer
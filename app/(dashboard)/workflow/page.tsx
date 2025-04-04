import { getWorkflowsForUser } from '@/actions/workflows/getWorkflowsForUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { waitFor } from '@/lib/helper/waitFor'
import { AlertCircle, InboxIcon } from 'lucide-react'
import React, { Suspense } from 'react'
import CreateWorflowDailog from './_components/CreateWorflowDailog'
import WorkflowCard from './_components/WorkflowCard'

const page = () => {
  return (
    <div className='flex-1 flex flex-col h-full'>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className='text-3xl font-bold'>
            WorkFlows
          </h1>
          <p className='text-muted-foreground'>Manage your workflows</p>
        </div>
        <CreateWorflowDailog/>
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton/>}>
          <UserWorkflows/>

        </Suspense>
      </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
  return <div className="space-y-2">
    {
      [1,2,3,4].map((i)=>(
        <Skeleton key={i} className='h-32 w-full'/>
      ))
    }
  </div>
}

async function UserWorkflows() {
  try {
    const workflows = await getWorkflowsForUser();

    if(workflows.length === 0) {
      return <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="rounded-full w-20 h-20 items-center justify-center bg-accent ">
          <InboxIcon className='stroke-primary' size={40} />
          </div>
          <div className="flex flex-col gap-1 text-center ">
            <p className='font-bold'>
              No workflows created yet
            </p>
            <p className='text-sm text-muted-foreground'>
              click on the button below to create a new workflow
            </p>

            <CreateWorflowDailog triggerText='Create Workflow'/>

            
          
        </div>

        

        
        
      </div>
    }
    return <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {
        workflows.map((workflow)=>(
          <WorkflowCard key={workflow.id} workflow={workflow}/>
        ))
      }
    </div>

  

  }
  catch(error) {
    return (
      <Alert variant={'destructive'}>
      <AlertCircle className='w-4 h-4'/>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong please try again later </AlertDescription>
    </Alert>
    )

  }
  
}


export default page
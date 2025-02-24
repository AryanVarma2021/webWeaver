"use client"

import CustomDailogHeader from '@/components/CustomDailogHeader'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Layers2Icon, Loader2 } from 'lucide-react'
import React, { useCallback } from 'react'

import { z } from 'zod'
import { createWorkflowSchema, CreateWorkflowSchemaType } from '@/schema/workflow'
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { CreateWorkflow } from '@/actions/workflows/createWorkflow'
import { toast } from 'sonner'


const CreateWorflowDailog = ({triggerText} : {triggerText?:string}) => {
    const [open, setOpen] = React.useState(false)
    const form = useForm<z.infer<typeof createWorkflowSchema>>({
      resolver : zodResolver(createWorkflowSchema),
      defaultValues : {
        name : "",
        description : ""
      },
    })

    const {mutate, isPending} = useMutation(({
      mutationFn : CreateWorkflow,
      onSuccess : () => {
        toast.success("Workflow created successfully", {id : "create-workflow"})
      },
      onError : () => {
        toast.error("Failed to create workflow", {id : "create-workflow"})
      },
    }))

    const onSubmit = useCallback((
      values : CreateWorkflowSchemaType
    )=>{
      toast.loading("Creating workflow", {id : "create-workflow"})
      mutate(values);
    }, [mutate])
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild >
            <Button>{triggerText ?? "Create workflow"}</Button>
        </DialogTrigger>
        <DialogContent className='px-0'>
            <CustomDailogHeader icon={Layers2Icon} title="Create workflow" subTitle="start building your worflow"/>

            <div className="p-6 ">
              <Form {...form} >
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>

                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=> (
                      <FormItem>
                        <FormLabel className='flex gap-1 items-center' >
                          Name
                          <p className='text-sm text-primary '>(required)</p>

                        </FormLabel>
                        <FormControl>
                          <Input {...field}/>
                        </FormControl>

                        <FormDescription>
                          Choose a description and unique name 
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({field})=> (
                      <FormItem>
                        <FormLabel className='flex gap-1 items-center' >
                          Description
                          <p className='text-sm text-muted-foreground  '>(optional)</p>

                        </FormLabel>
                        <FormControl>
                          <Textarea className='resize-none' {...field}/>
                        </FormControl>

                        <FormDescription>
                          Choose a description and unique name 
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                    />


                    <Button disabled={isPending} type='submit' className='w-full '>{isPending && <Loader2 className='animate-spin'/>} Submit</Button>

                    
                  </form>
              </Form>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorflowDailog
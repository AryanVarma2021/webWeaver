"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger

} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Workflow, WorkflowIcon } from "lucide-react";
import { useState } from "react";
import {DeleteWorkflow} from "@/actions/workflows/deleteWorkflow"
import { toast } from "sonner";


interface Props {
    open : boolean;
    setOpen : (open : boolean) => void;
    WorkflowName : string
    WorkflowId : string
}

function DeleteWorkflowDailog({open, setOpen, WorkflowName, WorkflowId} : Props) {
    const [confirmText, setConfirmText] = useState("")
    const deleteMutation = useMutation ({
        mutationFn : DeleteWorkflow,
        onSuccess : () => {
            toast.success("Deleted successfully", {id : WorkflowId})
            setConfirmText("")
        },
        onError : ()=> {
            toast.error("Something went wrong...", {id : WorkflowId})

        }
    })
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>If you delete this workflow you will not able to recover it</AlertDialogDescription>
                <div className="flex flex-col py-4 gap-2">
                    <p>
                        if you are sure , enter <b>{WorkflowName}</b> to confirm
                    </p>
                    <Input 
                     onChange={(e)=> setConfirmText(e.target.value)}
                     value={confirmText}/>
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                 onClick={(e)=>{
                    e.stopPropagation();
                    toast.loading("Deleting workflow ... ", {id : WorkflowId});
                    deleteMutation.mutate(WorkflowId)

                 }}
                 disabled={confirmText !== WorkflowName || deleteMutation.isPending}>Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWorkflowDailog;



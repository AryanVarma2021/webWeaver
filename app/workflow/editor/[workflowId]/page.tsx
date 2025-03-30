/**
 * This file defines the page component for the workflow editor.
 * It fetches the workflow data for the authenticated user and renders the Editor component.
 */

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import Editor from '../../_components/Editor';

/**
 * Page component for editing a workflow.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.workflowId - The ID of the workflow to edit.
 * @returns {JSX.Element} The rendered page component.
 */
const page = async ({ params }: { params: { workflowId: string } }) => {

    const workflowId = params.workflowId;
    const {userId} = await  auth();

    if(!userId) {
        return  <div>Unauthenticated</div>
    }

    /**
     * Fetch the workflow data for the authenticated user.
     */
    const workflow = await prisma.workflow.findUnique({
        where : {
            id : workflowId,
            userId
        }
    });

    if(!workflow) {
        return <div>Worflow not found </div>
    }

  return (
    <Editor workflow={workflow}/>
  )
}

export default page
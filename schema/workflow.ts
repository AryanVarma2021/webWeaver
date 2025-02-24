import {z} from 'zod'

export const createWorkflowSchema = z.object({
    name : z.string().nonempty(),
    description : z.string().optional(),
    
    
})

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>
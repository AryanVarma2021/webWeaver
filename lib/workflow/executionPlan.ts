import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

//4:44 
export enum FlowToExecutionPlanValidationError {
    "NO_ENTRY_POINT" ,
    "INVALID_INPUTS",

}
type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type : FlowToExecutionPlanValidationError;
        invalidElements? : AppNodeMissingInputs[];
    }
}

export function FlowToExecutionPlan(nodes : AppNode[], edges : Edge[]) : FlowToExecutionPlanType {

    const entryPoint = nodes.find((node)=> TaskRegistry[node.data.type].isEntryPoint);

    if(!entryPoint) {
       return {
        error : {
            type : FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
          
        }
       }
    }
    const inputwithErrors : AppNodeMissingInputs[] = [];
    const planned = new Set<string>();
    const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
    if(invalidInputs.length > 0) {
        inputwithErrors.push({nodeId : entryPoint.id, inputs : invalidInputs});
    }
    const executionPlan : WorkflowExecutionPlan = [
        {
            phase : 1,
            nodes : [entryPoint]

        },
    ];
    planned.add(entryPoint.id);


    for(let phase = 2 ; phase <= nodes.length && planned.size < nodes.length ; phase++) {

        const nextPhase:WorkflowExecutionPlanPhase = {phase, nodes : []};

        for(const currentNode of nodes) {
            if(planned.has(currentNode.id)) {
                continue;
            }

            const invalidInputs = getInvalidInputs(currentNode, edges, planned);

            if(invalidInputs.length > 0) {
                const incomers = getIncomers(currentNode, nodes, edges);

                if(incomers.every((incomer)=> planned.has(incomer.id))) {
                    console.log("invalid inputs", currentNode.id, invalidInputs);
                    inputwithErrors.push({nodeId : currentNode.id, inputs : invalidInputs});
                    
                }
                else {
                    continue;
                }
                
            }

            //all inputs are valid, add to the next phase
            nextPhase.nodes.push(currentNode);
            
        }
        for(const node of nextPhase.nodes){ planned.add(node.id);
        }
        executionPlan.push(nextPhase);


    }

    if(inputwithErrors.length > 0) {
        return {
            error : {
                type : FlowToExecutionPlanValidationError.INVALID_INPUTS,
                invalidElements : inputwithErrors
            }
        }

    }
    return {executionPlan}


}

function getInvalidInputs(node:AppNode, edges:Edge[], planned:Set<string>)  {


    const invalidInputs = [];

    const inputs =TaskRegistry[node.data.type].inputs;
    for(const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue?.length>0;

        if(inputValueProvided) {
            continue;
        }

        const incomingEdge = edges.filter((edge)=> edge.target === node.id);

        const inputEdgeByOutput = incomingEdge.find((edge => edge.targetHandle === input.name));

        const temp = input.required && inputEdgeByOutput && planned.has(inputEdgeByOutput.source) ;

        if(temp) {
            continue;
        }
        else if(!input.required) {

            if(!inputEdgeByOutput) {
               continue;
            }

            if(inputEdgeByOutput && planned.has(inputEdgeByOutput.source)) {
                continue;
            }
           
        }

        invalidInputs.push(input.name);




    }

    return invalidInputs;



}

function getIncomers(node:AppNode, nodes:AppNode[], edges:Edge[]) {
    if(!node) return [];

    const incomersTds = new Set();
    edges.forEach(edge => {
        if(edge.target === node.id) {
            incomersTds.add(edge.source);
        }
    })

    return nodes
    
}
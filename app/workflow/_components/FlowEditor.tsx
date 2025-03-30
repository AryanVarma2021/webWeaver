"use client";
import { Workflow } from '@prisma/client';
import { addEdge, Background, BackgroundVariant, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow, Edge, getOutgoers } from '@xyflow/react';
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import { CreateflowNode } from '@/lib/workflow/createflowNode';
import { Tasktype } from '@/types/Tasktype';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeleteEdge from './edges/DeleteEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';









const nodeTypes = {
  WebWeaverNode : NodeComponent,

}
const edgesTypes = {
  default : DeleteEdge,
}

const snapGrid : [number, number] = [20, 20]
const fitViewOptions = {padding:1}

const FlowEditor = ({workflow}: {workflow : Workflow}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode> ([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const {setViewport, screenToFlowPosition, updateNodeData} = useReactFlow();

  useEffect(()=>{
    console.log("nodes in useEffect", nodes);
    
    try {
      const flowString = workflow.definition;
      if(!flowString) return;

      const flow = JSON.parse(flowString);
      
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if(!flow.viewport) return;
      const {x=0, y=0, zoom=1} = flow.viewport;

      setViewport({x, y, zoom})


      
    } catch (error) {
      
    }
  }, [workflow.definition, setEdges, setNodes, setViewport])


  const onDragOver = useCallback((event:React.DragEvent)=>{
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  },[])

  const onDrop = useCallback((event:React.DragEvent)=>{
    event.preventDefault()
    
    const taskType = event.dataTransfer.getData("application/reactflow")
    if(!taskType || typeof taskType === undefined) return;

    const position = screenToFlowPosition({
      x : event.clientX,
      y : event.clientY,
    });
    const newNode = CreateflowNode(taskType as Tasktype, position)
    setNodes((nds) => nds.concat(newNode))

  }, [])


  const onConnect = useCallback((connection: Connection) => {
    console.log("in func nodes", nodes);

    setEdges((edg) => addEdge({ ...connection, animated: true }, edg));

    if (!connection.targetHandle) return;

    const node = nodes.find((n) => n.id === connection.target);
    console.log("in func nodes :", nodes);

    console.log("node ::", node);
    if (!node) return;

    const nodeInputs = node.data.inputs;
    console.log("n ::", nodeInputs);
    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: "",
      },
    });

    console.log(typeof connection.targetHandle, typeof connection.targetHandle);
  }, [nodes, setEdges, updateNodeData]); // Added `nodes` to the dependency array

  const isValidConnection = useCallback((connection : Edge | Connection)=>{

    const {sourceHandle, targetHandle, source, target} = connection;

    if(source == target) return false;
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if(!sourceNode || !targetNode) return false;

    const sourceType = TaskRegistry[sourceNode.data.type]
    const targetType = TaskRegistry[targetNode.data.type]

    const output = sourceType.outputs.find((o) => o.name === sourceHandle);
    const input = targetType.inputs.find((i) => i.name === targetHandle);

    if(!output || !input) return false;
    if(output.type !== input.type) return false;
    //if(sourceType === targetType) return false;
    //if(sourceHandle === targetHandle) return false;


    const hasCycle = (node:AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };

    const cycle = hasCycle(targetNode);
    return !cycle
    

  }, [nodes, edges])
 
  




    return (  
    <main className='h-full w-full  '>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgesTypes}
        fitView
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        
        >

            <Controls position='top-left' fitViewOptions={fitViewOptions} />
            <Background variant={BackgroundVariant.Dots} gap={20} size={2}/>
            

        </ReactFlow>
    </main>
  )
}

export default FlowEditor
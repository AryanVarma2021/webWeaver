"use client";
import { Workflow } from '@prisma/client';
import { addEdge, Background, BackgroundVariant, Connection, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow, Edge } from '@xyflow/react';
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import { CreateflowNode } from '@/lib/workflow/createflowNode';
import { Tasktype } from '@/types/Tasktype';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeleteEdge from './edges/DeleteEdge';









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


  console.log("out of : ", nodes);
  




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
        >

            <Controls position='top-left' fitViewOptions={fitViewOptions} />
            <Background variant={BackgroundVariant.Dots} gap={20} size={2}/>
            

        </ReactFlow>
    </main>
  )
}

export default FlowEditor
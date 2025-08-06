import { useState, useRef, useCallback } from 'react'
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow'
import { useStore } from '../store'
import { shallow } from 'zustand/shallow'
import { InputNode } from '../nodes/inputNode'
import { LLMNode } from '../nodes/llmNode'
import { OutputNode } from '../nodes/outputNode'
import { TextNode } from '../nodes/textNode'

import 'reactflow/dist/style.css'

const gridSize = 20
const proOptions = { hideAttribution: true }
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
}

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow)

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` }
    return nodeData
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'))
        const type = appData?.nodeType

        if (typeof type === 'undefined' || !type) {
          return
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const nodeID = getNodeID(type)
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        }

        addNode(newNode)
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background 
          color="#e5e7eb" 
          gap={gridSize} 
          size={1}
          variant="dots"
        />
        <Controls 
          className="bg-white shadow-medium border border-gray-200 rounded-lg"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-white"
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor="#3b82f6"
          nodeStrokeWidth={2}
          pannable
          zoomable
        />
      </ReactFlow>
      
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Pipeline</h3>
            <p className="text-gray-500 max-w-sm">
              Drag nodes from the toolbar above to create your data processing pipeline. 
              Connect them together to define the flow of data.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
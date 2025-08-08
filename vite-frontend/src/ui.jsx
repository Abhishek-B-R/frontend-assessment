'use client';

import { useState, useRef, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  MarkerType,
} from '@xyflow/react';
import { useStore } from './store';
import { InputNode } from './nodes/input-node';
import { LLMNode } from './nodes/llm-node';
import { OutputNode } from './nodes/output-node';
import { TextNode } from './nodes/text-node';
import { APINode } from './nodes/api-node';
import { FilterNode } from './nodes/filter-node';
import { TransformNode } from './nodes/transform-node';
import { DelayNode } from './nodes/delay-node';
import { WebhookNode } from './nodes/webhook-node';
import { VariableNode } from './nodes/variable-node';
import { MathNode } from './nodes/math-node';

import '@xyflow/react/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  filter: FilterNode,
  transform: TransformNode,
  delay: DelayNode,
  webhook: WebhookNode,
  variable: VariableNode,
  math: MathNode,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore();

  const getInitNodeData = (nodeID, type) => {
    const baseData = { id: nodeID, nodeType: type };

    switch (type) {
      case 'customInput':
        return { ...baseData, inputName: nodeID.replace('customInput-', 'input_'), inputType: 'Text' };
      case 'customOutput':
        return { ...baseData, outputName: nodeID.replace('customOutput-', 'output_'), outputType: 'Text' };
      case 'text':
        return { ...baseData, text: '{{input}}', variables: [] };
      case 'llm':
        return { ...baseData, model: 'gpt-3.5-turbo' };
      case 'api':
        return { ...baseData, url: '', method: 'GET' };
      case 'filter':
        return { ...baseData, condition: '' };
      case 'transform':
        return { ...baseData, transformation: '' };
      case 'delay':
        return { ...baseData, duration: 1000 };
      case 'webhook':
        return { ...baseData, url: '', secret: '' };
      case 'variable':
        return { ...baseData, key: '', value: '' };
      case 'math':
        return { ...baseData, expression: 'a + b', variables: { a: 1, b: 2 } };
      default:
        return baseData;
    }
  };


  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow') && reactFlowBounds && reactFlowInstance) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex-1">
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="w-full h-screen">
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
            snapToGrid={true}
            snapGrid={[gridSize, gridSize]}
            connectionLineType="smoothstep"
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2, stroke: '#3b82f6' },
              markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 }
            }}
            zoomOnScroll={false} // Disable zoom on scroll
            panOnScroll={true} // Enable pan on scroll
          >
            <Background color="#aaa" gap={gridSize} />
            <Controls />
            <MiniMap 
              nodeStrokeColor="#374151"
              nodeColor="#f3f4f6"
              nodeBorderRadius={8}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

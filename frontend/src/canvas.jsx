import { useRef, useState, useCallback } from 'react';
import { useStore } from './store';
import { PipelineNode } from './pipeline-node';
import { ConnectionLine } from './connection-line';

export const PipelineCanvas = () => {
  const canvasRef = useRef(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { 
    nodes, 
    connections, 
    getNodeID, 
    addNode, 
    updateNodePosition,
    addConnection
  } = useStore();

  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    try {
      const nodeData = JSON.parse(event.dataTransfer.getData('application/json'));
      const position = {
        x: event.clientX - canvasRect.left - 100,
        y: event.clientY - canvasRect.top - 40
      };

      const nodeId = getNodeID(nodeData.type);
      const newNode = {
        id: nodeId,
        type: nodeData.type,
        position,
        data: getInitialNodeData(nodeData.type, nodeId)
      };

      addNode(newNode);
      useStore.getState().autoConnectIfMatches?.(newNode);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  }, [addNode, getNodeID]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const getInitialNodeData = (type, id) => {
    switch (type) {
      case 'input':
        return { inputName: id.replace('input-', 'input_'), inputType: 'Text' };
      case 'output':
        return { outputName: id.replace('output-', 'output_'), outputType: 'Text' };
      case 'text':
        return { text: '{{input}}' };
      case 'llm':
        return { model: 'gpt-3.5-turbo' };
      default:
        return {};
    }
  };

  const handleNodeMouseDown = (nodeId, event) => {
    if (connecting) return; // Don't drag while connecting
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setDragOffset({
      x: event.clientX - node.position.x,
      y: event.clientY - node.position.y
    });
  };

  const handleMouseMove = useCallback((event) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const mousePos = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
    setMousePosition(mousePos);

    if (draggedNode && !connecting) {
      const newPosition = {
        x: mousePos.x - dragOffset.x,
        y: mousePos.y - dragOffset.y
      };
      updateNodePosition(draggedNode, newPosition);
    }
  }, [draggedNode, dragOffset, updateNodePosition, connecting]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
    setConnecting(null);
  }, []);

  const handleConnectionStart = (nodeId, handle, position, type) => {
    setConnecting({ nodeId, handle, position, type });
  };

  const handleConnectionEnd = (targetNodeId, targetHandle, targetType) => {
    if (connecting && connecting.nodeId !== targetNodeId) {
      // Ensure we're connecting output to input or vice versa
      if (
        (connecting.type === 'output' && targetType === 'input') ||
        (connecting.type === 'input' && targetType === 'output')
      ) {
        const connectionId = `${connecting.nodeId}-${targetNodeId}-${Date.now()}`;
        const sourceNodeId = connecting.type === 'output' ? connecting.nodeId : targetNodeId;
        const targetNodeIdFinal = connecting.type === 'output' ? targetNodeId : connecting.nodeId;
        
        addConnection({
          id: connectionId,
          source: sourceNodeId,
          target: targetNodeIdFinal,
          sourceHandle: connecting.type === 'output' ? connecting.handle : targetHandle,
          targetHandle: connecting.type === 'output' ? targetHandle : connecting.handle
        });
      }
    }
    setConnecting(null);
  };

  const handleCanvasClick = () => {
    if (connecting) {
      setConnecting(null);
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={`flex-1 bg-gray-100 relative overflow-hidden ${connecting ? 'cursor-crosshair' : 'cursor-default'}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Connection lines */}
      {connections.map(connection => {
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);
        
        if (!sourceNode || !targetNode) return null;

        return (
          <ConnectionLine
            key={connection.id}
            from={{ x: sourceNode.position.x + 200, y: sourceNode.position.y + 50 }}
            to={{ x: targetNode.position.x, y: targetNode.position.y + 50 }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map(node => (
        <PipelineNode
          key={node.id}
          node={node}
          onMouseDown={(event) => handleNodeMouseDown(node.id, event)}
          onConnectionStart={handleConnectionStart}
          onConnectionEnd={handleConnectionEnd}
          isConnecting={connecting !== null}
        />
      ))}

      {/* Temporary connection line while connecting */}
      {connecting && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <marker
                id="temp-arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#ef4444"
                />
              </marker>
            </defs>
            <path
              d={`M ${connecting.position.x} ${connecting.position.y} L ${mousePosition.x} ${mousePosition.y}`}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              markerEnd="url(#temp-arrowhead)"
            />
          </svg>
        </div>
      )}

      {/* Connection instructions */}
      {connecting && (
        <div className="absolute top-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm">
          <div className="font-medium text-blue-800">Connecting...</div>
          <div className="text-blue-600">
            Click on a {connecting.type === 'output' ? 'blue input' : 'green output'} handle to complete the connection
          </div>
          <div className="text-blue-500 text-xs mt-1">Click anywhere else to cancel</div>
        </div>
      )}
    </div>
  );
};

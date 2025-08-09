import { useState, useRef, useEffect } from 'react';
import { useStore } from './store';

export const PipelineNode = ({ 
  node, 
  onMouseDown, 
  onConnectionStart, 
  onConnectionEnd,
  isConnecting
}) => {
  const { updateNodeData, removeNode } = useStore();
  const [inputWidths, setInputWidths] = useState({});
  const measureRef = useRef(null);

  const handleInputChange = (field, value) => {
    updateNodeData(node.id, { [field]: value });

    if (measureRef.current) {
      measureRef.current.textContent = value || 'placeholder';
      const width = Math.max(measureRef.current.offsetWidth + 20, 80);
      setInputWidths(prev => ({ ...prev, [field]: width }));
    }

    const store = useStore.getState();
    if (field === 'inputName') {
      store.autoConnectIfMatches({
        id: node.id,
        type: 'input',
        data: { inputName: value }
      });
    } else if (field === 'text') {
      store.autoConnectIfMatches({
        id: node.id,
        type: 'text',
        data: { text: value }
      });
    }
  };

  const handleConnectionClick = (handle, type, event) => {
    event.stopPropagation();
    const rect = (event.target).getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    if (isConnecting) {
      onConnectionEnd(node.id, handle, type);
    } else {
      onConnectionStart(node.id, handle, position, type);
    }
  };

  // Initialize input widths
  useEffect(() => {
    if (measureRef.current) {
      const fields = ['inputName', 'outputName', 'text'];
      const newWidths = {};

      fields.forEach(field => {
        if (node.data[field]) {
          measureRef.current.textContent = node.data[field];
          newWidths[field] = Math.max(measureRef.current.offsetWidth + 20, 80);
        }
      });
      
      setInputWidths(newWidths);
    }
  }, [node.data]);

  const renderNodeContent = () => {
    switch (node.type) {
      case 'input':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-blue-700">Input</div>
            <div className="space-y-1">
              <label className="block text-xs">
                Name:
                <input
                  type="text"
                  value={node.data.inputName || ''}
                  onChange={(e) => handleInputChange('inputName', e.target.value)}
                  className="w-full text-xs p-1 border rounded mt-1"
                  style={{ width: inputWidths.inputName || 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
              <label className="block text-xs">
                Type:
                <select
                  value={node.data.inputType || 'Text'}
                  onChange={(e) => handleInputChange('inputType', e.target.value)}
                  className="w-full text-xs p-1 border rounded mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="Text">Text</option>
                  <option value="File">File</option>
                </select>
              </label>
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-green-700">Output</div>
            <div className="space-y-1">
              <label className="block text-xs">
                Name:
                <input
                  type="text"
                  value={node.data.outputName || ''}
                  onChange={(e) => handleInputChange('outputName', e.target.value)}
                  className="w-full text-xs p-1 border rounded mt-1"
                  style={{ width: inputWidths.outputName || 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
              <label className="block text-xs">
                Type:
                <select
                  value={node.data.outputType || 'Text'}
                  onChange={(e) => handleInputChange('outputType', e.target.value)}
                  className="w-full text-xs p-1 border rounded mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="Text">Text</option>
                  <option value="Image">Image</option>
                </select>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-purple-700">Text</div>
            <label className="block text-xs">
              Text:
              <input
                type="text"
                value={node.data.text || ''}
                onChange={(e) => handleInputChange('text', e.target.value)}
                className="w-full text-xs p-1 border rounded mt-1"
                style={{ width: inputWidths.text || 'auto' }}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          </div>
        );

      case 'llm':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-orange-700">LLM</div>
            <div className="text-xs text-gray-600">Large Language Model</div>
            <label className="block text-xs">
              Model:
              <select
                value={node.data.model || 'gpt-3.5-turbo'}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full text-xs p-1 border rounded mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </label>
          </div>
        );

      default:
        return <div>Unknown Node</div>;
    }
  };

  const hasInputHandle = node.type === 'llm' || node.type === 'output';
  const hasOutputHandle = node.type === 'input' || node.type === 'text' || node.type === 'llm';

  return (
    <div
      className={`absolute bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow ${
        isConnecting ? 'cursor-crosshair' : 'cursor-move'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: Math.max(200, Math.max(...Object.values(inputWidths)) + 40),
        minHeight: 100
      }}
      onMouseDown={onMouseDown}
    >
      {/* Hidden span for measuring text width */}
      <span
        ref={measureRef}
        className="absolute invisible text-xs p-1"
        style={{ whiteSpace: 'nowrap' }}
      />

      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          removeNode(node.id);
        }}
      >
        ×
      </button>

      {/* Input handle */}
      {hasInputHandle && (
        <div
          className={`absolute left-0 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md transition-all ${
            isConnecting ? 'cursor-crosshair hover:scale-125 hover:bg-blue-600' : 'cursor-pointer hover:scale-110'
          }`}
          onClick={(e) => handleConnectionClick('input', 'input', e)}
          title="Input connection point"
        />
      )}

      {/* Output handle */}
      {hasOutputHandle && (
        <div
          className={`absolute right-0 top-1/2 w-4 h-4 bg-green-500 rounded-full transform translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md transition-all ${
            isConnecting ? 'cursor-crosshair hover:scale-125 hover:bg-green-600' : 'cursor-pointer hover:scale-110'
          }`}
          onClick={(e) => handleConnectionClick('output', 'output', e)}
          title="Output connection point"
        />
      )}

      {renderNodeContent()}
    </div>
  );
};

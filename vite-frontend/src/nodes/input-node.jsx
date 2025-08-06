import { useState, useRef } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const InputNode = (props) => {
  const [currName, setCurrName] = useState(props.data?.inputName || props.id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(props.data.inputType || 'Text');
  const measureRef = useRef(null);

  const handleNameChange = (e, updateField, setNodeWidth) => {
    setCurrName(e.target.value);
    updateField('inputName', e.target.value);
    
    // Auto-resize logic for horizontal expansion
    if (measureRef.current) {
      measureRef.current.textContent = e.target.value || 'placeholder';
      const width = Math.max(measureRef.current.offsetWidth + 80, 200); // Add padding and min width
      setNodeWidth(width);
    }
  };

  const handleTypeChange = (e, updateField) => {
    setInputType(e.target.value);
    updateField('inputType', e.target.value);
  };

  const config = {
    title: 'Input',
    color: 'text-blue-700',
    borderColor: 'border-blue-300',
    handles: [
      {
        id: 'value',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ updateField, setNodeWidth }) => (
      <>
        <span ref={measureRef} className="absolute invisible text-sm font-medium" style={{ whiteSpace: 'nowrap' }} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
          <input 
            type="text" 
            value={currName} 
            onChange={(e) => handleNameChange(e, updateField, setNodeWidth)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
          <select 
            value={inputType} 
            onChange={(e) => handleTypeChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

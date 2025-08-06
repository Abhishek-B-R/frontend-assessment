import { useState, useRef } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const OutputNode = (props) => {
  const [currName, setCurrName] = useState(props.data?.outputName || props.id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(props.data.outputType || 'Text');
  const measureRef = useRef(null);

  const handleNameChange = (e, updateField, setNodeWidth) => {
    setCurrName(e.target.value);
    updateField('outputName', e.target.value);
    
    if (measureRef.current) {
      measureRef.current.textContent = e.target.value || 'placeholder';
      const width = Math.max(measureRef.current.offsetWidth + 80, 200);
      setNodeWidth(width);
    }
  };

  const handleTypeChange = (e, updateField) => {
    setOutputType(e.target.value);
    updateField('outputType', e.target.value);
  };

  const config = {
    title: 'Output',
    color: 'text-green-700',
    borderColor: 'border-green-300',
    handles: [
      {
        id: 'value',
        type: 'target',
        position: Position.Left,
        style: { left: -8 }
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
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
          <select 
            value={outputType} 
            onChange={(e) => handleTypeChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

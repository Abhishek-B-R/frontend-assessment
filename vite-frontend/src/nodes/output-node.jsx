import { useState, useRef } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const OutputNode = (props) => {
  const [currName, setCurrName] = useState(props.data?.outputName || props.id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(props.data.outputType || 'Text');
  const measureRef = useRef(null);

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
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <>
        <span className="absolute invisible text-sm font-medium" style={{ whiteSpace: 'nowrap' }} />
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <textarea
            value={currName}
            rows={1}
            ref={measureRef}
            onChange={(e) => handleTextChange(e, updateField, setNodeWidth, setNodeHeight, setCurrName, measureRef)}
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

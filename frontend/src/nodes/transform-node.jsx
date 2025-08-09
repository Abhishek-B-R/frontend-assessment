import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const TransformNode = (props) => {
  const [transformation, setTransformation] = useState(props.data?.transformation || '');

  const config = {
    title: 'Transform',
    color: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    handles: [
      {
        id: 'input',
        type: 'target',
        position: Position.Left,
        style: { left: -8 }
      },
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ updateField }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transformation:</label>
        <select 
          value={transformation} 
          onChange={(e) => {
            setTransformation(e.target.value);
            updateField('transformation', e.target.value);
          }}
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select transformation</option>
          <option value="uppercase">To Uppercase</option>
          <option value="lowercase">To Lowercase</option>
          <option value="reverse">Reverse Text</option>
          <option value="length">Get Length</option>
          <option value="trim">Trim Whitespace</option>
        </select>
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

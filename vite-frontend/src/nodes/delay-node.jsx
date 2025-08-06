import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const DelayNode = (props) => {
  const [duration, setDuration] = useState(props.data?.duration || 1000);

  const config = {
    title: 'Delay',
    color: 'text-gray-700',
    borderColor: 'border-gray-300',
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (ms):</label>
        <input 
          type="number" 
          value={duration} 
          onChange={(e) => {
            setDuration(parseInt(e.target.value));
            updateField('duration', parseInt(e.target.value));
          }}
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          min="0"
          step="100"
        />
        <div className="mt-1 text-xs text-gray-500">
          Delay execution by {duration}ms
        </div>
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

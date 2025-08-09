import { useRef, useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const DelayNode = (props) => {
  const [duration, setDuration] = useState(props.data?.duration || 1000);
  const delayRef = useRef(null);

  const config = {
    title: 'Delay',
    color: 'text-amber-700',
    borderColor: 'border-amber-300',
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
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <div>
        <label className="block text-sm font-medium text-amber-700 mb-1">Duration (ms):</label>
        <input
          type="number" 
          ref={delayRef}
          value={duration}                  
          onChange={(e) => {
            setDuration(parseInt(e.target.value));
            updateField('duration', parseInt(e.target.value));
            handleTextChange(e, updateField, setNodeWidth, setNodeHeight, setDuration, delayRef)
          }}
          className="w-full text-sm p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          min={0}
          max={1000000}
          step="100"
        />
        <div className="mt-1 text-xs text-amber-500">
          Delay execution by {duration} ms
        </div>
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

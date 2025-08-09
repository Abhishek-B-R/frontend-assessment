import { useRef, useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const FilterNode = (props) => {
  const [condition, setCondition] = useState(props.data?.condition || '');
  const filterRef = useRef(null);
  const config = {
    title: 'Filter',
    color: 'text-rose-700',
    borderColor: 'border-rose-300',
    handles: [
      {
        id: 'input',
        type: 'target',
        position: Position.Left,
        style: { left: -8 }
      },
      {
        id: 'true',
        type: 'source',
        position: Position.Right,
        style: { right: -8, top: '30%' }
      },
      {
        id: 'false',
        type: 'source',
        position: Position.Right,
        style: { right: -8, top: '70%' }
      }
    ],
    content: ({ updateField,setNodeHeight,setNodeWidth }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition:</label>
        <textarea
          rows={1}
          ref={filterRef}
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value);
            updateField('condition', e.target.value);
            handleTextChange(e, updateField, setNodeWidth, setNodeHeight, setCondition, filterRef);
          }}
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="value > 10"
        />
        <div className="mt-2 text-xs text-gray-500">
          <div>✓ True output (top)</div>
          <div>✗ False output (bottom)</div>
        </div>
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

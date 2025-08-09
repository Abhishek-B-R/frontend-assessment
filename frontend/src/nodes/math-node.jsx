import { useState, useEffect } from 'react';
import { Position, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const MathNode = (props) => {
  const [operation, setOperation] = useState(props.data?.operation || 'add');
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(props.id);
  }, [operation, props.id, updateNodeInternals]);

  const config = {
    title: 'Math',
    color: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    handles: [
      { id: 'a', type: 'target', position: Position.Left, style: { top: '30%', left: -8 } },
      { id: 'b', type: 'target', position: Position.Left, style: { top: '70%', left: -8 } },
      { id: 'result', type: 'source', position: Position.Right, style: { right: -8 } }
    ],
    content: ({ updateField }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operation:</label>
        <select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value);
            updateField('operation', e.target.value);
          }}
          className="w-full text-sm p-2 border border-gray-300 rounded"
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

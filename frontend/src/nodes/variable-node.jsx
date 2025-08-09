import { useState, useEffect, useRef } from 'react';
import { Position, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const VariableNode = (props) => {
  const [key, setKey] = useState(props.data?.key || '');
  const [value, setValue] = useState(props.data?.value || '');
  const updateNodeInternals = useUpdateNodeInternals();
  const keyRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => {
    updateNodeInternals(props.id);
  }, [key, value, props.id, updateNodeInternals]);

  const config = {
    title: 'Variable',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    handles: [
      { id: 'output', type: 'source', position: Position.Right, style: { right: -8 } }
    ],
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key:</label>
          <textarea
            ref={keyRef}
            rows={1}
            value={key}
            onChange={(e) => {
              handleTextChange(e, updateField, setNodeWidth, setNodeHeight,setKey,keyRef)
            }}
            className="w-full text-sm p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value:</label>
          <textarea
            ref={valueRef}
            rows={1}
            value={value}
            onChange={(e) => {
              handleTextChange(e, updateField, setNodeWidth, setNodeHeight,setValue,valueRef)
            }}
            className="w-full text-sm p-2 border border-gray-300 rounded"
          />
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

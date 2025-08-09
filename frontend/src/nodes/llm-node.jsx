import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const LLMNode = (props) => {
  const [model, setModel] = useState(props.data?.model || 'gpt-3.5-turbo');

  const handleModelChange = (e, updateField) => {
    setModel(e.target.value);
    updateField('model', e.target.value);
  };

  const config = {
    title: 'LLM',
    color: 'text-orange-700',
    borderColor: 'border-orange-300',
    handles: [
      {
        id: 'system',
        type: 'target',
        position: Position.Left,
        style: { left: -8, top: '30%' }
      },
      {
        id: 'prompt',
        type: 'target',
        position: Position.Left,
        style: { left: -8, top: '70%' }
      },
      {
        id: 'response',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ updateField }) => (
      <>
        <div className="text-sm text-gray-600 mb-3">Large Language Model</div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model:</label>
          <select 
            value={model} 
            onChange={(e) => handleModelChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="gpt-5">GPT-5</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-3">Claude 3</option>
            <option value="claude-3.7">Claude 3.7</option>
          </select>
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

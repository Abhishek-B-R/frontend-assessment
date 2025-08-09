import { useRef, useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const WebhookNode = (props) => {
  const [url, setUrl] = useState(props.data?.url || '');
  const [secret, setSecret] = useState(props.data?.secret || '');
  const textareaRef = useRef(null);

  const config = {
    title: 'Webhook',
    color: 'text-pink-700',
    borderColor: 'border-pink-300',
    handles: [
      {
        id: 'data',
        type: 'target',
        position: Position.Left,
        style: { left: -8 }
      },
      {
        id: 'success',
        type: 'source',
        position: Position.Right,
        style: { right: -8, top: '30%' }
      },
      {
        id: 'error',
        type: 'source',
        position: Position.Right,
        style: { right: -8, top: '70%' }
      }
    ],
    content: ({ updateField,setNodeHeight,setNodeWidth }) => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL:</label>
          <textarea
            value={url} 
            rows={1}
            ref={textareaRef}
            onChange={(e) => {
              handleTextChange(e, updateField, setNodeWidth, setNodeHeight,setUrl,textareaRef)
            }}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="https://webhook.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secret (optional):</label>
          <input 
            type="password" 
            value={secret} 
            onChange={(e) => {
              setSecret(e.target.value);
              updateField('secret', e.target.value);
            }}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="webhook secret"
          />
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

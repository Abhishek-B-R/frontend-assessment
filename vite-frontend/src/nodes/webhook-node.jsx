import { useState } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const WebhookNode = (props) => {
  const [url, setUrl] = useState(props.data?.url || '');
  const [secret, setSecret] = useState(props.data?.secret || '');

  const config = {
    title: 'Webhook',
    color: 'text-teal-700',
    borderColor: 'border-teal-300',
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
    content: ({ updateField }) => (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL:</label>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => {
              setUrl(e.target.value);
              updateField('url', e.target.value);
            }}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="https://webhook.site/..."
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
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="webhook secret"
          />
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

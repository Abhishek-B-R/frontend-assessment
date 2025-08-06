import { useState, useRef, useEffect } from 'react';
import { Position, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const APINode = (props) => {
  const [url, setUrl] = useState(props.data?.url || '');
  const [inputWidth, setInputWidth] = useState(100); // State for input's calculated width
  const urlMeasureRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Effect to measure input width and update state
  useEffect(() => {
    if (urlMeasureRef.current) {
      urlMeasureRef.current.textContent = url || 'placeholder';
      const newWidth = Math.max(urlMeasureRef.current.offsetWidth + 20, 100);
      if (newWidth !== inputWidth) {
        setInputWidth(newWidth);
      }
    }
  }, [url, inputWidth]);

  // Effect to notify React Flow when the input's size (and thus node's potential size) changes
  useEffect(() => {
    updateNodeInternals(props.id);
  }, [inputWidth, props.id, updateNodeInternals]);

  const handleUrlChange = (e, updateField) => {
    setUrl(e.target.value);
    updateField('url', e.target.value);
  };

  const handleMethodChange = (e, updateField) => {
    updateField('method', e.target.value);
  };

  const config = {
    title: 'API Call',
    color: 'text-red-700',
    borderColor: 'border-red-300',
    handles: [
      {
        id: 'url',
        type: 'target',
        position: Position.Left,
        style: { left: -8, top: '25%' }
      },
      {
        id: 'data',
        type: 'target',
        position: Position.Left,
        style: { left: -8, top: '75%' }
      },
      {
        id: 'response',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ data, updateField }) => (
      <>
        <span ref={urlMeasureRef} className="absolute invisible text-sm font-medium" style={{ whiteSpace: 'nowrap' }} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL:</label>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => handleUrlChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://api.example.com"
            style={{ width: inputWidth }} // Apply the calculated width from state
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method:</label>
          <select 
            value={data.method || 'GET'} 
            onChange={(e) => handleMethodChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

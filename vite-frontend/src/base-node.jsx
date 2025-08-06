import { useState } from 'react';
import { Handle } from '@xyflow/react';
import { useStore } from './store';

export const BaseNode = ({ id, data, config }) => {
  const { updateNodeField } = useStore();
  const [nodeWidth, setNodeWidth] = useState(config.minWidth || 200);
  const [nodeHeight, setNodeHeight] = useState(config.minHeight || 100);

  const updateField = (fieldName, fieldValue) => {
    updateNodeField(id, fieldName, fieldValue);
  };

  return (
    <div 
      className={`bg-white border-2 rounded-lg p-4 shadow-lg ${config.borderColor}`}
      style={{ 
        width: nodeWidth,
        minHeight: nodeHeight,
        minWidth: config.minWidth || 200
      }}
    >
      {/* Handles */}
      {config.handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          className="w-4 h-4 border-2 border-white shadow-md"
          style={{
            backgroundColor: handle.type === 'source' ? '#10b981' : '#3b82f6',
            ...handle.style
          }}
        />
      ))}

      {/* Header */}
      <div className="mb-3">
        <div className={`font-semibold text-lg mb-2 ${config.color}`}>
          {config.title}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {typeof config.content === 'function' 
          ? config.content({ data, updateField, setNodeWidth, setNodeHeight })
          : config.content
        }
      </div>
    </div>
  );
};

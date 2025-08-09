import { useState, useRef } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { useStore } from '../store';
import { handleTextChange } from './handleTextChange';

export const InputNode = (props) => {
  const [currName, setCurrName] = useState(
    props.data?.inputName || props.id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useState(props.data.inputType || 'Text');
  const measureRef = useRef(null);

  const handleNameChange = (e, updateField) => {
    const newName = e.target.value;
    setCurrName(newName);
    updateField('inputName', newName);

    useStore.getState().autoConnectIfMatches?.({
      id: props.id,
      type: 'input',
      data: { inputName: newName }
    });
  };

  const handleTypeChange = (e, updateField) => {
    const newType = e.target.value;
    setInputType(newType);
    updateField('inputType', newType);

    // Optionally reset the name when type changes
    const defaultName = props.id.replace('customInput-', 'input_');
    setCurrName(defaultName);
    updateField('inputName', defaultName);

    // Trigger auto-connect for defaultName
    useStore.getState().autoConnectIfMatches?.({
      id: props.id,
      type: 'input',
      data: { inputName: defaultName }
    });
  };

  const config = {
    title: 'Input',
    color: 'text-blue-700',
    borderColor: 'border-blue-300',
    handles: [
      {
        id: 'value',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <>
        <span
          ref={measureRef}
          className="absolute invisible text-sm font-medium"
          style={{ whiteSpace: 'nowrap' }}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          {inputType === 'File' ? (
            <input
              type="file"
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                handleNameChange(e, updateField);
                // no width/height adjustments for file input
              }}
            />
          ) : (
            <textarea
              rows={1}
              value={currName}
              onChange={(e) => {
                handleNameChange(e, updateField);
                handleTextChange(
                  e,
                  updateField,
                  setNodeWidth,
                  setNodeHeight,
                  setCurrName,
                  measureRef,
                  props.id
                );
              }}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type:
          </label>
          <select
            value={inputType}
            onChange={(e) => handleTypeChange(e, updateField)}
            className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </div>
      </>
    )
  };

  return <BaseNode {...props} config={config} />;
};

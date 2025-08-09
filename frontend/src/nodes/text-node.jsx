import { useState, useRef, useMemo, useEffect } from 'react';
import { Position, useUpdateNodeInternals } from '@xyflow/react';
import { BaseNode } from '../base-node';
import { extractVariables } from './handleTextChange';
import { useStore } from '../store';

export const TextNode = (props) => {
  const [currText, setCurrText] = useState(props.data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(props.id);
  }, [currText, props.id, updateNodeInternals]);


  // Access all nodes from store
  const allNodes = useStore((state) => state.nodes);

  const handleTextChange = (e, updateField, setNodeWidth, setNodeHeight) => {
    const newText = e.target.value;
    setCurrText(newText);
    updateField('textName', newText);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      const width = Math.min(Math.max(newText.length * 8 + 40, 200), 400);
      const height = textareaRef.current.scrollHeight + 24;
      setNodeWidth(width);
      setNodeHeight(height);
    }

    // Update auto-connect matches
    useStore.getState().autoConnectIfMatches?.({
      id: props.id,
      type: 'text',
      data: { text: newText }
    });
  };

  const validVariables = useMemo(() => {
    const vars = new Set();

    allNodes.forEach((node) => {
      if (node.type === 'customInput') {
        if (node.data?.inputName) {
          vars.add(node.data.inputName.trim());
        }
      }
      if (node.type === 'variable' && node.data?.varName) {
        vars.add(node.data.varName.trim());
      }
    });

    return vars;
  }, [allNodes]);

  // Extract variables from the current text
  const extractedVars = extractVariables(currText);

  // Only keep variables that exist in validVariables set
  const matchedVars = extractedVars.filter((v) => validVariables.has(v));

  // Create dynamic handles only for valid matches
  const dynamicHandles = matchedVars.map((variable, index) => ({
    id: `var-${variable}`,
    type: 'target',
    position: Position.Left,
    style: {
      left: -8,
      top: `${30 + index * 25}%`,
      backgroundColor: '#8b5cf6'
    },
    label: variable
  }));

  const config = {
    title: 'Text',
    color: 'text-purple-700',
    borderColor: 'border-purple-300',
    handles: [
      ...dynamicHandles,
      {
        id: 'output',
        type: 'source',
        position: Position.Right,
        style: { right: -8 }
      }
    ],
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text:</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) =>
            handleTextChange(
              e,
              updateField,
              setNodeWidth,
              setNodeHeight,
              setCurrText,
              textareaRef
            )
          }
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-hidden"
          placeholder="Enter text with variables like {{input}}"
          rows={1}
        />
        {matchedVars.length > 0 && (
          <div className="mt-2 text-xs text-purple-600">
            Variables: {matchedVars.join(', ')}
          </div>
        )}
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

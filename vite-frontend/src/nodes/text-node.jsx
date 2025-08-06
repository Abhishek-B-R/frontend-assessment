import { useState, useRef, useEffect } from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from '../base-node';

export const TextNode = (props) => {
  const [currText, setCurrText] = useState(props.data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  const extractVariables = (text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  };

  const handleTextChange = (e, updateField, setNodeWidth, setNodeHeight) => {
    const newText = e.target.value;
    setCurrText(newText);
    updateField('text', newText);

    // Extract variables and update handles
    const newVariables = extractVariables(newText);
    setVariables(newVariables);
    updateField('variables', newVariables);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      const width = Math.min(Math.max(newText.length * 8 + 40, 200), 400); // max width
      const height = textareaRef.current.scrollHeight + 100; // padding for label + variables

      setNodeWidth(width);
      setNodeHeight(height);
    }
  };

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
  }, [currText]);

  // Create dynamic handles for variables
  const dynamicHandles = variables.map((variable, index) => ({
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
          onChange={(e) => handleTextChange(e, updateField, setNodeWidth, setNodeHeight)}
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none overflow-hidden"
          placeholder="Enter text with variables like {{input}}"
          rows={1}
        />
        {variables.length > 0 && (
          <div className="mt-2 text-xs text-purple-600">
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

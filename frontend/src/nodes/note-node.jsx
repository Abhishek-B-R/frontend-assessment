import { useState, useRef } from 'react';
import { BaseNode } from '../base-node';

export const NoteNode = (props) => {
  const [currText, setCurrText] = useState(props.data?.text || '');
  const textareaRef = useRef(null);

  const config = {
    title: 'Note',
    color: 'text-slate-700',
    borderColor: 'border-slate-300',
    handles: [], // No handles, isolated node
    content: ({ updateField, setNodeWidth, setNodeHeight }) => (
      <div>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => {
            const newText = e.target.value;
            setCurrText(newText);
            updateField('text', newText);

            // Auto resize
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              const width = Math.min(
                Math.max(newText.length * 8 + 40, 200),
                400
              );
              const height = textareaRef.current.scrollHeight + 24;
              setNodeWidth(width);
              setNodeHeight(height);
            }
          }}
          className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none overflow-hidden"
          placeholder="Write your notes here..."
          rows={2}
        />
      </div>
    )
  };

  return <BaseNode {...props} config={config} />;
};

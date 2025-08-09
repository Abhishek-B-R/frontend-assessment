import { useStore } from '../store';

export const extractVariables = (text) => {
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

export const handleTextChange = (
  e,
  updateField,
  setNodeWidth,
  setNodeHeight,
  setText,
  textareaRef,
  nodeId
) => {
  const newText = e.target.value;
  setText(newText);
  updateField('text', newText);

  try {
    useStore.getState().autoConnectIfMatches?.({
      id: nodeId,
      type: 'text',
      data: { text: newText }
    });
  } catch (err) {
    console.warn('autoConnectIfMatches call failed', err);
  }

  const newVariables = extractVariables(newText);
  updateField('variables', newVariables);

  if (textareaRef?.current) {
    textareaRef.current.style.height = 'auto'; // reset
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

    const width = Math.min(Math.max(newText.length * 8 + 40, 200), 400); // max width
    const height = textareaRef.current.scrollHeight + 24; // small padding
    setNodeWidth(width);
    setNodeHeight(height);
  }
};

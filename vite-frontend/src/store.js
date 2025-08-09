import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from '@xyflow/react';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({
          ...connection, 
          type: 'smoothstep', 
          animated: true, 
          markerEnd: {
            type: MarkerType.Arrow, 
            height: 20, 
            width: 20
          },
          style: {
            strokeWidth: 2,
            stroke: '#3b82f6'
          }
        }, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
          return node;
        }),
      });
    },
    // inside your useStore create(...) object
    autoConnectIfMatches: (newNode) => {
      const { nodes, edges, onConnect } = get();

      const normalize = (str) => (typeof str === 'string' ? str.trim().toLowerCase() : '');
      const isInputLike = (n) => {
        return n?.type === 'input' || n?.type === 'customInput' || n?.type === 'variable';
      };
      const existing = new Set((edges || []).map(e => `${e.source}=>${e.target}`));
      const added = new Set(); 

      const tryConnect = (src, tgt) => {
        if (!src || !tgt) return;
        const key = `${src}=>${tgt}`;
        if (existing.has(key) || added.has(key)) return;
        onConnect({ source: src, target: tgt });
        added.add(key);
      };
      const varMatches = (text = '') => {
        const matches = [];
        const re = /\{\{\s*([\w]+)\s*\}\}/g;
        let m;
        while ((m = re.exec(text)) !== null) {
          if (m[1]) matches.push(m[1]);
        }
        return matches;
      };

      if (newNode?.type === 'input' || newNode?.type === 'customInput' || newNode?.type === 'variable') {
        nodes.forEach(node => {
          if (node.type === 'text' && node.data?.text) {
            const refs = varMatches(node.data.text);
            refs.forEach(ref => {
              const varName = normalize(ref);
              const inputName = normalize(newNode.data?.inputName || newNode.data?.key || '');
              // tolerant match: inputName starts with varName (so input_1 matches "input")
              if (varName && inputName.startsWith(varName)) {
                tryConnect(newNode.id, node.id);
              }
            });
          }
        });
      }
      
      if (newNode?.type === 'text') {
        const refs = varMatches(newNode.data?.text || '');
        refs.forEach(ref => {
          const varName = normalize(ref);
          if (!varName) return;
          nodes.forEach(node => {
            if (isInputLike(node)) {
              const inputName = normalize(node.data?.inputName || node.data?.key || '');
              if (inputName.startsWith(varName)) {
                tryConnect(node.id, newNode.id);
              }
            }
          });
        });
      }
    },
}));

import { useState, useRef } from "react";
import { Position } from "@xyflow/react";
import { BaseNode } from "../base-node";
import { handleTextChange } from "./handleTextChange"; // Assuming this utility function is defined

export const APINode = (props) => {
  const [url, setUrl] = useState(props.data?.url || "");
  const urlMeasureRef = useRef(null);
  const textareaRef = useRef(null);

  const handleMethodChange = (e, updateField) => {
    updateField("method", e.target.value);
  };
  

  const config = {
    title: "API Call",
    color: "text-red-700",
    borderColor: "border-red-300",
    handles: [
      {
        id: "url",
        type: "target",
        position: Position.Left,
        style: { left: -8, top: "25%" },
      },
      {
        id: "data",
        type: "target",
        position: Position.Left,
        style: { left: -8, top: "75%" },
      },
      {
        id: "response",
        type: "source",
        position: Position.Right,
        style: { right: -8 },
      },
    ],
    content: ({ data, updateField, setNodeWidth, setNodeHeight }) => (
      <>
        <span
          ref={urlMeasureRef}
          className="absolute invisible text-sm font-medium"
          style={{ whiteSpace: "nowrap" }}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL:
          </label>
          <textarea
            value={url}
            ref={textareaRef}
            onChange={(e) =>
              handleTextChange(e, updateField, setNodeWidth, setNodeHeight,setUrl,textareaRef)
            }
            className="w-full text-sm p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://api.example.com"
            rows={1}
            style={{ height: "auto" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Method:
          </label>
          <select
            value={data.method || "GET"}
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
    ),
  };

  return <BaseNode {...props} config={config} />;
};

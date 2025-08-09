# ✅ Your Overall Goals
* Deliver a clean, abstracted node system that’s scalable.

* Design a polished, intuitive UI (minimal but elegant).

* Add dynamic interactivity in the Text node (auto-resize + dynamic handles).

* Wire everything to a FastAPI backend with pipeline validation.

   **BONUS:** Add thoughtful UX and engineering polish to outperform other candidates.

# 🧩 Phase 1: Node Abstraction
## 🔹 Goals
Refactor the current node types (input, output, LLM, text) to remove duplicated logic and centralize structure.

## 🔹 Steps
1. **Identify Shared Logic:**
   - Inspect all 4 nodes.
   - List all repeated props/components (e.g., Handles, `useReactFlow`, styles, node content, etc.)

2. **Create a Generic BaseNode Component:**
   - Props: title, inputs, outputs, content, style
   - Automatically generate input/output handles based on those props.
   - Accept children for node-specific inner content.

3. **Refactor Existing Nodes:**
   - Convert each node to just wrap BaseNode with specific props.

4. **Create 5 New Nodes (as per instructions):**
   - E.g., MathNode, PromptNode, ImageNode, DelayNode, SwitchNode
   - They don’t need full logic, just demonstrate the abstraction.

## ✅ Done When:
- All existing nodes are reduced to just 10–15 lines each.
- Adding a new node takes < 5 mins.
- 5 new nodes are added with zero duplication.

# 🎨 Phase 2: Styling
## 🔹 Goals
Make the app look clean, cohesive, and user-friendly.

## 🔹 Steps
1. **Install Tailwind CSS (done).**

2. **Design a Minimal Theme:**
   - Light or dark — choose one and stick to it.
   - Define a consistent card-like node style: shadows, spacing, border-radius.

3. **Standardize Typography and Colors:**
   - Use Tailwind classes in BaseNode.
   - Make TextInput, Buttons, Toolbars consistent.

4. **Improve UX:**
   - Add hover effects on nodes.
   - Make the canvas scroll/pan smoothly.
   - Add drag cursor hints.

## ✅ Done When:
- UI is consistent across nodes.
- Looks good on both light and dark backgrounds.
- Easy to distinguish between node types.

# ⭐ Bonus Idea:
- Add a mini toolbar above each node (delete, duplicate, settings).
- Responsive canvas layout for small screens.

# ✍️ Phase 3: Text Node Logic
## 🔹 Goals
Auto-resize the Text node as user types.

Parse `{{variable}}` and add a Handle for each.

## 🔹 Steps
1. **Auto-Resize Input:**
   - Use a textarea with dynamic sizing (e.g., hidden div mirror technique or onInput resize logic).

2. **Parse Variables:**
   - Regex match: `/\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g`
   - Store matched variable names in a `useState`.

3. **Add Handles Dynamically:**
   - Render a new left Handle for each unique variable from the regex result.

4. **Avoid Duplicates and Handle Deletion:**
   - If variable is removed from text, its Handle disappears.

## ✅ Done When:
- Typing resizes the node.
- `{{hello}}` creates a Handle.
- Removing `{{hello}}` removes the Handle.

# ⭐ Bonus Ideas:
- Add tooltip on hover of variable handle (e.g., "Variable: hello").
- Highlight `{{variables}}` in the input visually (via syntax highlighting?).

# 🔁 Phase 4: Backend Integration
## 🔹 Goals
Send graph data to backend, receive analysis (node/edge count and DAG validation), show result.

## 🔹 Steps
1. **Frontend: `submit.js`:**
   - Collect current nodes and edges from `ReactFlowInstance`.
   - POST to `/pipelines/parse` as JSON string.

2. **Backend: FastAPI Endpoint:**
   - Parse input data.
   - Count `nodes.length` and `edges.length`.

# Implement DAG check:

```python
def is_dag(nodes, edges):
    graph = defaultdict(list)
    for e in edges:
        graph[e["source"]].append(e["target"])
    visited = set()
    rec_stack = set()
    
    def dfs(v):
        visited.add(v)
        rec_stack.add(v)
        for neighbor in graph[v]:
            if neighbor not in visited and dfs(neighbor):
                return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(v)
        return False
    
    return not any(dfs(n["id"]) for n in nodes if n["id"] not in visited)
```

Return JSON: `{ num_nodes, num_edges, is_dag }`

# Frontend Alert:

On response, show styled modal/alert:

```yaml
✅ Pipeline Submitted!
• Nodes: 4
• Edges: 5
• DAG: Yes
✅ Done When:
Submitting graph sends request.

Backend responds correctly.

Alert is shown with clear message.
```

## ⭐ Bonus Ideas:

- Add validation before submission (e.g., “Missing required connection”).
- Graph-level error highlighting if `is_dag == false`.

### ✨ Extra Touches to Stand Out (Founder-Level)
If I were the founder, these things would impress me the most:

| Feature                      | Why It Impresses                                      |
|------------------------------|------------------------------------------------------|
| Clean Node Abstraction       | Shows long-term maintainability focus                 |
| Minimalist, Beautiful UI     | UX awareness = user-centric engineer                 |
| Variable Handle Logic        | Handles parsing, state, UI coordination — hard to get right |
| DAG Check                    | Real understanding of graph theory + backend skills  |
| Tooling Polish               | E.g., draggable canvas, reset button, node minimap   |
| No Bugs or Crashes           | Reliability > Features                                |
| Extensible Architecture       | I can add more nodes easily = scalable product       |

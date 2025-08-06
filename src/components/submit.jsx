@@ .. @@
   const handleSubmit = async () => {
     const pipeline = {
       nodes: nodes.map(node => ({
         id: node.id,
         type: node.type,
         data: node.data,
         position: node.position
       })),
       edges: edges.map(edge => ({
         id: edge.id,
         source: edge.source,
         target: edge.target,
         sourceHandle: edge.sourceHandle,
         targetHandle: edge.targetHandle
       }))
     }
 
     try {
-      const response = await fetch('http://localhost:8000/pipelines/parse', {
+      const formData = new FormData()
+      formData.append('pipeline', JSON.stringify(pipeline))
+      
+      const response = await fetch('http://localhost:8000/pipelines/parse', {
         method: 'POST',
-        headers: {
-          'Content-Type': 'application/json',
-        },
-        body: JSON.stringify({ pipeline: JSON.stringify(pipeline) }),
+        body: formData,
       })
       
       const result = await response.json()
@@ .. @@
       alert('Pipeline submitted successfully!')
     } catch (error) {
       console.error('Error submitting pipeline:', error)
       alert('Error submitting pipeline. Please try again.')
     }
   }
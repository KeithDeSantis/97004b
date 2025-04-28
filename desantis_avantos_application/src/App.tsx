import React, { useCallback, useState, useEffect } from 'react';
import logo from './logo.svg';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  useNodes,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import PrefillModal from './PrefillModal';

// URL to query the "action-blueprint-graph-get" endpoint
const endpointURL = "http://localhost:3000/api/v1/1/actions/blueprints/1/graph"

// Initial nodes and edges with type definitions
let initialNodes: { id: string, position: { x: number, y: number }, data: {label: string, raw: {}, parents: string[]} }[]  = [];
const initialEdges: { id: string, source: string, target: string }[] = [];

let defaultNode = {
  id: '0',
  position: {
    x: 0,
    y: 0
  },
  data: {
    label: ''
  }
}

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [prefillIsOpen, setPrefillIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node>(defaultNode);
  const reactFlowInstance = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  // todo change event from any
  // Select the clicked node and open prefill modal
  const onNodeClick = (event: any, node: Node) => {
    setSelectedNode(node);
    setPrefillIsOpen(true);
  }

  // Helpers
  function getNodeById(id: string) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i]['id'] == id) {
        return nodes[i];
      }
    }
    return nodes[0];
  }
  function getParentIds(id: string): string[] {
    let n = getNodeById(id);
    return n['data']['parents'];
  }
  // Todo assuming this is fine to do since the challenge implies there is only one root
  function getRootId(id: string): string {
    if(!getParentIds(id)) {
      return id;
    }
    else {
      return getRootId(getParentIds(id)[0]);
    }
  }

  // todo theres gotta be a better way to traverse back than adding the nodes to the data dictionary
  // Async function to get graph from endpoint
  async function getGraph() {
    let endpointData = await fetch(endpointURL).then((response) => response.json());
    let endpointNodes: { id: string, position: { x: number, y: number }, data: {label: string, raw: {}, parents: string[] } }[] = [];
    let endpointEdges: { id: string, source: string, target: string }[] = [];
    // todo this is a terrible way to do this
    let parentDict: { [id: string] : string[] } = {};
    for(let i = 0; i < endpointData['edges'].length; i++) {
      let edge = endpointData['edges'][i];
      endpointEdges.push({
        // Edge id will be source and target ids concatenated with an underscore
        id: edge['source'] + "_" + edge["target"],
        source: edge['source'],
        target: edge['target']
      });
      if (!parentDict[edge['target']]) {
        parentDict[edge['target']] = [];
      }
      parentDict[edge['target']].push(edge['source']);
    }
    for(let i = 0; i < endpointData['nodes'].length; i++) {
      let node = endpointData['nodes'][i];
      endpointNodes.push({
        id: node['id'],
        position: {
          x: node['position']['x'],
          y: node['position']['y']
        },
        data: {
          label: node['data']['name'],
          raw: node,
          parents: parentDict[node['id']]
        }
      });
    }
    setNodes(endpointNodes);
    setEdges(endpointEdges);
  }

  // Use effect to call our async function and update our nodes and edges
  useEffect(() => {
    getGraph();
  }, []);


  return (
    <>
      <PrefillModal open={prefillIsOpen} onClose={() => setPrefillIsOpen(false)} node={selectedNode} getRootId={getRootId} getNodeById={getNodeById} />
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;

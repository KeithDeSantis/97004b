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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

// URL to query the "action-blueprint-graph-get" endpoint
const endpointURL = "http://localhost:3000/api/v1/1/actions/blueprints/1/graph"

// Initial nodes and edges with type definitions
let initialNodes: { id: string, position: { x: number, y: number }, data: {label: string} }[]  = [];
const initialEdges: { id: string, source: string, target: string }[] = [];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  // Async function to get graph from endpoint
  async function getGraph() {
    let endpointData = await fetch(endpointURL).then((response) => response.json());
    let endpointNodes: { id: string, position: { x: number, y: number }, data: {label: string} }[] = [];
    let endpointEdges: { id: string, source: string, target: string }[] = [];
    for(let i = 0; i < endpointData['nodes'].length; i++) {
      let node = endpointData['nodes'][i];
      endpointNodes.push({
        id: node['id'],
        position: {
          x: node['position']['x'],
          y: node['position']['y']
        },
        data: {
          label: node['data']['name']
        }
      });
    }
    for(let i = 0; i < endpointData['edges'].length; i++) {
      let edge = endpointData['edges'][i];
      endpointEdges.push({
        // Edge id will be source and target ids concatenated with an underscore
        id: edge['source'] + "_" + edge["target"],
        source: edge['source'],
        target: edge['target']
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
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}

export default App;

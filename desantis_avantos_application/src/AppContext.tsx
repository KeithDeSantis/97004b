import React, { useCallback, useContext, useState, useEffect, type Dispatch } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import PrefillModal from './PrefillModal';

// URL to query the "action-blueprint-graph-get" endpoint
const endpointURL = "http://localhost:3001/api/v1/1/actions/blueprints/1/graph"
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
let initialForms: { id: string, field_schema: string[] }[] = []

const PrefillIsOpenContext = React.createContext(false);
const MapperIsOpenContext = React.createContext(false);
const OpenMappingModalContext = React.createContext(() => {});
const CloseMappingModalContext = React.createContext(() => {});
const NodesContext = React.createContext(initialNodes);
const EdgesContext = React.createContext(initialEdges);
const SelectedNodeContext = React.createContext<Node>(defaultNode);
const ClosePrefillModalContext = React.createContext(() => {});
const FormsContext = React.createContext(initialForms);
const SelectedPrefillContext = React.createContext("");
const SetSelectedPrefillContext = React.createContext<any>(null);
export function usePrefillIsOpen() { return useContext(PrefillIsOpenContext); }
export function useMapperIsOpen() { return useContext(MapperIsOpenContext); }
export function useOpenMappingModal() { return useContext(OpenMappingModalContext); }
export function useCloseMappingModal() { return useContext(CloseMappingModalContext); }
export function useNodesCtx() { return useContext(NodesContext); }
export function useEdgesCtx() { return useContext(EdgesContext); }
export function useSelectedNode() { return useContext(SelectedNodeContext); }
export function useClosePrefillModal() { return useContext(ClosePrefillModalContext); }
export function useFormsContext() { return useContext(FormsContext); }
export function useSelectedPrefillContext() { return useContext(SelectedPrefillContext); }
export function useSetSelectedPrefillContext() { return useContext(SetSelectedPrefillContext); }

export function AppProvider() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [prefillIsOpen, setPrefillIsOpen] = useState(false);
    const [mappingIsOpen, setMappingIsOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Node>(defaultNode);
    const [selectedPrefill, setSelectedPrefill] = useState("");
    const [forms, setForms] = useState(initialForms);

    const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
    );

    // Select the clicked node and open prefill modal
    const onNodeClick = (event: any, node: Node) => {
        setSelectedNode(node);
        setPrefillIsOpen(true);
    }

    function openMappingModal() {
        setMappingIsOpen(true);
    }

    function closeMappingModal() {
        if(mappingIsOpen) { setMappingIsOpen(false); }
    }

    function closePrefillModal() {
        if(prefillIsOpen) {
            setPrefillIsOpen(false);
            setMappingIsOpen(false);
        }
    }

    // todo theres gotta be a better way to traverse back than adding the nodes to the data dictionary
    // Async function to get graph from endpoint
    async function getGraph() {
        let endpointData = await fetch(endpointURL).then((response) => response.json());
        let endpointNodes: { id: string, position: { x: number, y: number }, data: {label: string, raw: {}, parents: string[], component_id: string } }[] = [];
        let endpointEdges: { id: string, source: string, target: string }[] = [];
        let endpointForms: { id: string, field_schema: string[] }[] = [];
        // todo this is a terrible way to do this
        let parentDict: { [id: string] : string[] } = {};
        for(let edge of endpointData['edges']) {
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
        for(let node of endpointData['nodes']) {
            endpointNodes.push({
            id: node['id'],
            position: {
                x: node['position']['x'],
                y: node['position']['y']
            },
            data: {
                label: node['data']['name'],
                raw: node,
                parents: parentDict[node['id']],
                component_id: node['data']['component_id']
            }
            });
        }
        for(let form of endpointData['forms']) {
            endpointForms.push({
                id: form['id'],
                field_schema: Object.keys(form['field_schema']['properties'])
        });
        }
        setNodes(endpointNodes);
        setEdges(endpointEdges);
        setForms(endpointForms);
    }

    // Use effect to call our async function and update our nodes and edges from the API endpoint's data
    useEffect(() => {
        getGraph();
    }, []);

    // In order to maintain separation of state by nodes, each has its own prefill and mapping modal.
    // Could maybe create custom nodes to store info relating to the prefill UI, but for sake of time will do it this way
    let prefillModals = nodes.map(n => <PrefillModal key={n['id']} node={n} />);
    //let mappingModals = nodes.map(n => <MappingModal key={n['id']} node={n} />);

    return (
        <PrefillIsOpenContext.Provider value={prefillIsOpen}>
            <MapperIsOpenContext.Provider value={mappingIsOpen}>
                <OpenMappingModalContext.Provider value={openMappingModal}>
                    <CloseMappingModalContext.Provider value={closeMappingModal}>
                        <NodesContext.Provider value={nodes}>
                            <EdgesContext.Provider value={edges}>
                                <SelectedNodeContext.Provider value={selectedNode}>
                                    <ClosePrefillModalContext.Provider value={closePrefillModal}>
                                        <FormsContext.Provider value={forms}>    
                                            <SelectedPrefillContext.Provider value={selectedPrefill}>
                                                <SetSelectedPrefillContext.Provider value={setSelectedPrefill}>
                                                    {prefillModals}
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
                                                </SetSelectedPrefillContext.Provider>
                                            </SelectedPrefillContext.Provider>
                                        </FormsContext.Provider>  
                                    </ClosePrefillModalContext.Provider>
                                </SelectedNodeContext.Provider>
                            </EdgesContext.Provider>
                        </NodesContext.Provider>  
                    </CloseMappingModalContext.Provider>
                </OpenMappingModalContext.Provider>              
            </MapperIsOpenContext.Provider>
        </PrefillIsOpenContext.Provider>
    );
}
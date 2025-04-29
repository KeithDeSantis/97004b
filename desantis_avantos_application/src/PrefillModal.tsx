import { Node } from '@xyflow/react';
import { clear } from 'console';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { ObjectFlags } from 'typescript';
import MappingModal from './MappingModal';
import PrefillInput from './PrefillInput';
import { usePrefillIsOpen, useNodesCtx, useSelectedNode, useClosePrefillModal } from './AppContext'

export default function PrefillModal({ node }: { node: Node }) {

    const prefillIsOpen = usePrefillIsOpen();
    const nodes = useNodesCtx();
    const selectedNode = useSelectedNode();
    const closePrefillModal = useClosePrefillModal();

    const portalDiv = document.getElementById('prefillPortal')!;
    const [emailSelected, setEmailSelected] = useState(true);
    const [checkboxSelected, setCheckboxSelected] = useState(false);
    const [objectSelected, setObjectSelected] = useState(false);

    function clearSelection(event: React.MouseEvent<HTMLElement>) {
        let btn = event.target as HTMLButtonElement;
        let btnId = btn.id;
        if(btnId == "email") {
            setEmailSelected(false);
        } else if(btnId == "object") {
            setObjectSelected(false);
        } else if(btnId == "checkbox") {
            setCheckboxSelected(false);
        }
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

    if(prefillIsOpen && node['id'] == selectedNode['id']) {
        const rootId: string = getRootId(node['id']);
        const root = getNodeById(rootId);
        const rootLabel = root['data']['label'];
        //todo tmp
        let emailStr = emailSelected ? "email: "+rootLabel+".email": "email";
        return ReactDom.createPortal(
            <>
                <div id="prefillOverlay" onClick={closePrefillModal} />
                <MappingModal />
                <div id="prefillModalContainer" className="container vertical mGap">
                    <div className="container horizontal sGap">
                        <button onClick={closePrefillModal}>x</button>
                        Prefill
                    </div>
                    <PrefillInput type="checkBox" visible={checkboxSelected} value="dynamic_checkbox_group" clearSelection={clearSelection} />
                    <PrefillInput type="object" visible={objectSelected} value="dynamic_object" clearSelection={clearSelection} />
                    <PrefillInput type="email" visible={emailSelected} value={emailStr} clearSelection={clearSelection} />
                </div>
            </>,
            portalDiv
        );
    } else {
        return <></>
    }
}
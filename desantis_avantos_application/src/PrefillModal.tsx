import { Node } from '@xyflow/react';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import PrefillInput from './PrefillInput';
import MappingModal from './MappingModal';
import { usePrefillIsOpen, useMapperIsOpen, useNodesCtx, useSelectedNode, useClosePrefillModal, useCloseMappingModal } from './AppContext'

export default function PrefillModal({ node }: { node: Node }) {

    // Contexts
    const prefillIsOpen = usePrefillIsOpen();
    const nodes = useNodesCtx();
    const selectedNode = useSelectedNode();
    const closePrefillModal = useClosePrefillModal();
    const closeMappingModal = useCloseMappingModal();

    // Constants
    const portalDiv = document.getElementById('prefillPortal')!;

    // State
    const [emailSelected, setEmailSelected] = useState(true);
    const [checkboxSelected, setCheckboxSelected] = useState(false);
    const [objectSelected, setObjectSelected] = useState(false);
    const [emailString, setEmailString] = useState('replace');
    const [objectString, setObjectString] = useState('dynamic_object');
    const [checkboxString, setCheckboxString] = useState('dynamic_checkbox_group');

    // Clear selection of input field
    function clearSelection(event: React.MouseEvent<HTMLElement>) {
        let btn = event.target as HTMLButtonElement;
        let btnId = btn.id;
        if(btnId == "email") {
            setEmailSelected(false);
            setEmailString("email");
        } else if(btnId == "dynamic_object") {
            setObjectSelected(false);
            setObjectString("dynamic_object");
        } else if(btnId == "dynamic_checkbox_group") {
            setCheckboxSelected(false);
            setCheckboxString("dynamic_checkbox_group");
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
    // Assuming this is fine to do since the challenge implies there is only one root
    function getRootId(id: string): string {
        if(!getParentIds(id)) {
            return id;
        }
        else {
            return getRootId(getParentIds(id)[0]);
        }
    }

    // Handles changing the field value chosen in the mapping modal
    function selectMapping(form: string, option: string, inputType: string) {
        // weird bug where selectMapping() is getting called when
        // clicking the prefill options to open the mapping modal
        // temporary fix in place
        if(form) {
            let newValue = inputType + ": " + form + "." + option
            if(inputType == "email") {
                setEmailSelected(true);
                setEmailString(newValue);
            } else if (inputType == "dynamic_checkbox_group") {
                setCheckboxSelected(true);
                setCheckboxString(newValue);
            } else if (inputType == "dynamic_object") {
                setObjectSelected(true);
                setObjectString(newValue);
            }
        }
    }

    if(prefillIsOpen && node['id'] == selectedNode['id']) {
        // Set email to root's email to start
        const root = getNodeById(getRootId(node['id']));
        const rootLabel = root['data']['label'];
        if(emailString == 'replace') {
            setEmailString(emailSelected ? "email: "+rootLabel+".email": "email");
        }
        return ReactDom.createPortal(
            <>
                <MappingModal key={node['id'] + 'checkbox'} node={node} inputType='dynamic_checkbox_group' selectMapping={selectMapping} />
                <MappingModal key={node['id'] + 'object'} node={node} inputType='dynamic_object' selectMapping={selectMapping} />
                <MappingModal key={node['id'] + 'email'} node={node} inputType='email' selectMapping={selectMapping} />
                <div id="prefillOverlay" onClick={closePrefillModal} />
                <div id="prefillModalContainer" className="container vertical mGap" onClick={closeMappingModal}>
                    <div className="container horizontal sGap">
                        <button onClick={closePrefillModal}>x</button>
                        Prefill
                    </div>
                    <PrefillInput type="dynamic_checkbox_group" visible={checkboxSelected} value={checkboxString} clearSelection={clearSelection} />
                    <PrefillInput type="dynamic_object" visible={objectSelected} value={objectString} clearSelection={clearSelection} />
                    <PrefillInput type="email" visible={emailSelected} value={emailString} clearSelection={clearSelection} />
                </div>
            </>,
            portalDiv
        );
    } else {
        return <></>
    }
}
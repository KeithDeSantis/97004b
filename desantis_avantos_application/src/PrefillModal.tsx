import { Node } from '@xyflow/react';
import { clear } from 'console';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { ObjectFlags } from 'typescript';
import MappingModal from './MappingModal';
import PrefillInput from './PrefillInput';

//todo this modal is shared (info wise) between all nodes atm. Gotta fix that

export default function PrefillModal({ getNodeById, getRootId, onClose, open, node}: { getNodeById: any, getRootId: any, onClose: any; open: boolean, node: Node }) {
    const portalDiv = document.getElementById('prefillPortal')!;
    const [emailSelected, setEmailSelected] = useState(true);
    const [checkboxSelected, setCheckboxSelected] = useState(false);
    const [objectSelected, setObjectSelected] = useState(false);
    const [mappingIsOpen, setMappingIsOpen] = useState(false);

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

    //todo gotta pass in which element is being adjusted here
    function openMappingModal() {
        setMappingIsOpen(true);
    }

    
    if(open) {
        const root = getNodeById(getRootId(node));
        const rootLabel = root['data']['label'];
    //todo tmp
    let emailStr = "email: "+rootLabel+".email";
        return ReactDom.createPortal(
            <>
                <div id="prefillOverlay" onClick={onClose} />
                <MappingModal open={mappingIsOpen} />
                <div id="prefillModalContainer" className="container vertical mGap">
                    <div className="container horizontal sGap">
                        <button onClick={onClose}>x</button>
                        Prefill
                    </div>
                    <PrefillInput type="checkBox" visible={checkboxSelected} value="dynamic_checkbox_group" clearSelection={clearSelection} openMapper={openMappingModal}/>
                    <PrefillInput type="object" visible={objectSelected} value="dynamic_object" clearSelection={clearSelection} openMapper={openMappingModal}/>
                    <PrefillInput type="email" visible={emailSelected} value={emailStr} clearSelection={clearSelection} openMapper={openMappingModal}/>
                </div>
            </>,
            portalDiv
        );
    } else {
        return <></>
    }
}
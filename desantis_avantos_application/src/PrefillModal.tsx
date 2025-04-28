import { Node } from '@xyflow/react';
import { clear } from 'console';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { ObjectFlags } from 'typescript';
import MappingModal from './MappingModal';

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
        if(btnId == "emailBtn") {
            setEmailSelected(false);
        } else if(btnId == "objectBtn") {
            setObjectSelected(false);
        } else if(btnId == "checkboxBtn") {
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
        return ReactDom.createPortal(
            <>
                <div id="prefillOverlay" onClick={onClose} />
                <MappingModal open={mappingIsOpen} />
                <div id="prefillModalContainer" className="container vertical mGap">
                    <div className="container horizontal sGap">
                        <button onClick={onClose}>x</button>
                        Prefill
                    </div>
                    { checkboxSelected &&
                        <div className="container horizontal sGap">
                            <span className="prefill prefillChosen">dynamic_checkbox_group</span>
                            <button id="checkboxBtn" onClick={clearSelection}>x</button>
                        </div>
                    }
                    { !checkboxSelected &&
                        <span className="prefill prefillEmpty" onClick={openMappingModal}>dynamic_checkbox_group</span>
                    }
                    { objectSelected &&
                        <div className="container horizontal sGap">
                            <span className="prefill prefillChosen">dynamic_object</span>
                            <button id="objectBtn" onClick={clearSelection}>x</button>
                        </div>
                    }
                    { !objectSelected &&
                        <span className="prefill prefillEmpty" onClick={openMappingModal}>dynamic_object</span>
                    }
                    { emailSelected &&
                        <div className="container horizontal sGap">
                            <span className="prefill prefillChosen">email: {rootLabel}.email</span>
                            <button  id="emailBtn" onClick={clearSelection}>x</button>
                        </div>
                    }
                    { !emailSelected &&
                        <span className="prefill prefillEmpty"  onClick={openMappingModal}>email</span>
                    }
                </div>
            </>,
            portalDiv
        );
    } else {
        return <></>
    }
}
import React, { useState } from 'react'
import ReactDom from 'react-dom';
import { useMapperIsOpen, useSelectedPrefillContext, useNodesCtx, useFormsContext, useCloseMappingModal } from './AppContext'
import { Node } from '@xyflow/react';

export default function MappingModal({ node, inputType, selectMapping }: { node: Node, inputType: string, selectMapping: any }) {

    // Contexts
    const mappingIsOpen = useMapperIsOpen();
    const selectedPrefill = useSelectedPrefillContext();
    const nodes = useNodesCtx();
    const forms = useFormsContext();
    const closeMappingModal = useCloseMappingModal();

    // Constants
    const portalDiv = document.getElementById('mappingPortal')!;

    // State
    const [selectedOption, setSelectedOption] = useState<HTMLElement>();

    // Show dropdown options
    function selectDropdown(event: React.MouseEvent<HTMLElement>) {
        let btn = event.target as HTMLButtonElement;
        let content;
        // May have clicked the carot instead of the whole dropdown. Put this hacky workaround in place for now to get more important functionality working
        if(btn.children.length != 0) {
            btn.classList.toggle('selectedDropdown');
            btn.children[0].classList.toggle('closed');
            content = btn.nextElementSibling!;
        } else {
            btn.classList.toggle('closed');
            btn.parentElement!.classList.toggle('selectedDropdown');
            content = btn.parentElement!.nextElementSibling!;
        }
        content.classList.toggle('collapsed');
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
    // Get a list of all ancestor ids
    function getAncestors(id: string, ancestors: string[]): string[] {
        let prntIds = getParentIds(id);
        if(!prntIds || prntIds.length == 0) {
            return [];
        }
        else {
            for(let parent of prntIds) {
                ancestors.push(parent);
                ancestors.concat(getAncestors(parent, ancestors));
            }
            // Deduplicate ancestor list
            return [... new Set(ancestors)];
        }
    }

    // Get form options from a form
    function getFormOptions(nodeToCheck: Node): string[] {
        let component_id = nodeToCheck['data']['component_id'];
        let options: string[] = [];
        for(let form of forms) {
            if(form['id'] == component_id) {
                options = form['field_schema'];
            }
        }
        return options;
    }

    // Choose an event
    function selectOption(event: React.MouseEvent<HTMLElement>) {
        let option = event.target as HTMLElement;
        if(selectedOption) {
            selectedOption.classList.toggle('selectedOption');
            selectedOption.classList.toggle('option');
        }
        setSelectedOption(option);
        option.classList.toggle('selectedOption');
        option.classList.toggle('option');
    }

    if(mappingIsOpen && selectedPrefill == inputType) {
        // Get ancestor Ids
        let ancestors = getAncestors(node['id'], []).sort((a: string,b: string) => {
            return getNodeById(a)['data']['label'].localeCompare(getNodeById(b)['data']['label']);
        });
        // Construct inherited dropdowns and their options based on the field_schemas received by the API endpoint
        let inheritedDropdowns = ancestors.map(a =>
            <div key={a} id={getNodeById(a)['data']['label']}>
                <button className="dropdown" onClick={selectDropdown}><i className="caret-down closed">&#9660;</i>{getNodeById(a)['data']['label']}</button>
                <div className="container vertical mGap collapsed">
                    { getFormOptions(getNodeById(a)).map(o => 
                        <a key={o} className="option" onClick={selectOption}>{o}</a>
                    ) }
                </div>
            </div>
        );

        return ReactDom.createPortal(
            <div className="mappingContainer container vertical mGap">
                <div id="Action Properties">
                    <button className="dropdown" onClick={selectDropdown}><i className="caret-down closed">&#9660;</i>Action Properties</button>
                    <div className="dropdown-container container vertical mGap collapsed">
                        <a className="option" onClick={selectOption}>Action 1</a>
                        <a className="option" onClick={selectOption}>Action 2</a>
                        <a className="option" onClick={selectOption}>Action 3</a>
                    </div>
                </div>
                <div id="Action Properties">
                    <button className="dropdown" onClick={selectDropdown}><i className="caret-down closed">&#9660;</i>Client Organisation Properties</button>
                    <div className="dropdown-container container vertical mGap collapsed">
                        <a className="option" onClick={selectOption}>Prop 1</a>
                        <a className="option" onClick={selectOption}>Prop 2</a>
                        <a className="option" onClick={selectOption}>Prop 3</a>
                    </div>
                </div>
                {inheritedDropdowns}
                <div className="container horizontal lGap">
                    <button id='confirm' onClick={selectMapping(selectedOption?.parentElement?.parentElement?.id, selectedOption?.innerText, inputType)}>Confirm</button>
                    <button onClick={closeMappingModal}>Cancel</button>
                </div>
            </div>,
            portalDiv
        );
    }
    else {
        return <></>
    }
}
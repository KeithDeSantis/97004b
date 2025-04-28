import { Node } from '@xyflow/react';
import { clear } from 'console';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { ObjectFlags } from 'typescript';

export default function MappingModal({ open }: { open: boolean }) {
    const portalDiv = document.getElementById('mappingPortal')!;
    console.log(open);

    if(open) {
        return ReactDom.createPortal(
            <div className="mappingContainer container vertical mGap">text</div>,
            portalDiv
        );
    }
    else {
        return <></>
    }
}
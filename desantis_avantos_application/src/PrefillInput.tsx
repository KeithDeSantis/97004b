import { Node } from '@xyflow/react';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { useOpenMappingModal, useSetSelectedPrefillContext } from './AppContext'

export default function PrefillInput({ type, visible, value, clearSelection }: { type: string, visible: boolean, value: string, clearSelection: any }) {

  const openMappingModal = useOpenMappingModal();
  const setSelectedPrefillContext = useSetSelectedPrefillContext();

  // Create span element with appropriate styling and onClick functionality
  let spanElement = <span className={visible ? "prefill prefillChosen" : "prefill prefillEmpty"} onClick={() => {
    if(!visible) {
      setSelectedPrefillContext(type);
      openMappingModal();
    }
  }}>{value}</span>

  // Return div based on if the option has a value in it or not
  return (
    <div className="container horizontal sGap">
      {spanElement}
      { visible && <button id={type} onClick={clearSelection}>x</button> }
    </div>
  );

}
 
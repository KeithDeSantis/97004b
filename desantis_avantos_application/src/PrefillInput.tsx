import { Node } from '@xyflow/react';
import React, { useState } from 'react';
import ReactDom from 'react-dom';

//todo this modal is shared (info wise) between all nodes atm. Gotta fix that

export default function PrefillInput({ type, visible, value, clearSelection, openMapper }: { type: string, visible: boolean, value: string, clearSelection: any, openMapper: any }) {

  // Create span element with appropriate styling and onClick functionality
  let spanElement = <span className={visible ? "prefill prefillChosen" : "prefill prefillEmpty"} onClick={() => {
    if(!visible) {
    openMapper();
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
 
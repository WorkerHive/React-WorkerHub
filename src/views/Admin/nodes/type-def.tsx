import React from 'react';

import { NodeWrapper, withEditor } from '@workerhive/hive-flow';
import  ReactJson from 'react-json-view'

export const type = 'typeDef'

export interface ModalProps {
    node: any;
}

export const modal = (props : any) => {
    console.log(props)
    return <div style={{flex: 1}}>
        <ReactJson src={props.node.data.typedef} />
    </div>
}


export const node = withEditor((props : any) => {
    return (
    <NodeWrapper {...props}>
      <div style={{padding: 8}} className="type-def">
        {props.id && props.data.label || "Type Def"}
     </div>
    </NodeWrapper>
    )
})
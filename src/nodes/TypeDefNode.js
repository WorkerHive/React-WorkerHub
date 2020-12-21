import React from 'react'

import { NodeWrapper, withEditor } from 'react-hive-flow';
import  ReactJson from 'react-json-view'
export const type = 'typeDef'

export const modal = withEditor((props) => {

  return (
    <div style={{flex: 1}}>
      <ReactJson src={props.node.data.typedef} />
    </div>
  )
})

export const node = withEditor((props) => {
    return (
    <NodeWrapper {...props}>
      <div style={{padding: 8}} className="type-def">
        {props.id && props.data.label || "Type Def"}
     </div>
    </NodeWrapper>
    )
})
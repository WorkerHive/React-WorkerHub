import React from 'react';

import { NodeWrapper, withEditor } from '@workerhive/hive-flow';

export const type = 'extStore'

export const modal = (props : any) => {

  return (
    <div style={{flex: 1}}>
    </div>
  )
}

export const node = (props : any) => {
    return (
    <NodeWrapper {...props}>
      <div style={{padding: 8}} className="ext-store">
        {props.id && props.data.label || "External Store"}
     </div>
    </NodeWrapper>
    )
}
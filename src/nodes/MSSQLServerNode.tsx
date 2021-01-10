import React from 'react'

import {
    TextField
} from '@material-ui/core';

import { NodeWrapper, withEditor } from '@workerhive/hive-flow';

export const type = 'mssql server'

export const modal = withEditor((props) => {

  return (
    <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
        <TextField label="Connection Name" value={props.node.data.label} onChange={(e) => {
            props.editor.updateNode(props.node.id, (node) => {
                node.data.label = e.target.value;
                return node;
            })
        }}/>
        <TextField label="Host IP:Host Port" value={props.node.data.host} onChange={(e) => {
          props.editor.updateNode(props.node.id, (node) => {
            node.data.host = e.target.value;
            return node;
          })
        }}/>
        <TextField label="Database Name" value={props.node.data.db} onChange={(e) => {
          props.editor.updateNode(props.node.id, (node) => {
            node.data.db = e.target.value;
            return node;
          })
        }}/>
        <TextField label="Username" value={props.node.data.username} onChange={(e) => {
          props.editor.updateNode(props.node.id, (node) => {
            node.data.username = e.target.value;
            return node;
          })
        }}/>
        <TextField label="Password" type="password" value={props.node.data.password} onChange={(e) => {
          props.editor.updateNode(props.node.id, (node) => {
            node.data.password = e.target.value;
            return node;
          })
        }} />
    </div>
  )
})

export const node = withEditor((props) => {
    return (
    <NodeWrapper {...props}>
      <div style={{padding: 8}} className="mssql-adapter">
        <span style={{fontSize: 11}}>MSSQL</span>
        <span>{props.id && props.data.label || "MSSQL Server"}</span>
     </div>
    </NodeWrapper>
    )
})
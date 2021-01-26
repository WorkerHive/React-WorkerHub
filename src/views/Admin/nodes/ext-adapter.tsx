import React from 'react';

import { NodeWrapper, useEditor, withEditor } from '@workerhive/hive-flow';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useHub } from '@workerhive/client/dist/react';

export const type = 'extAdapter'

const Modal = (props : any) => {

    const client = props.client;
    const editor = props.editor;

    const getStore = () => {
        let storeLink = editor.links.filter((a : any) => a.source == props.node.id)[0]
        console.log(storeLink)
        if(storeLink){
            let storeNode = editor.nodes.filter((a : any) => a.id == storeLink.target)[0]
            console.log(storeLink)
            return storeNode
        }
    }

    const getModel = () => {
        let storeLink = editor.links.filter((a : any) => a.target == props.node.id)[0]
        console.log(storeLink)
        if(storeLink){
            let storeNode = editor.nodes.filter((a : any) => a.id == storeLink.source)[0]
            console.log(storeLink)
            return storeNode;
        }
    }

    const updateModelLink = (target : string) => {
        let storeLink = editor.links.filter((a : any) => a.target == props.node.id)[0]
        if(storeLink){
            props.editor.addLink(target, props.node.id)
            props.editor.onElementsRemove([storeLink])

        }
    }

  const renderFields = () => {
    let type : any = getModel();


    let returnType = type.data.typedef.map((x : any) => {
        return (
            <div style={{borderBottom: '1px solid green', marginBottom: 4, paddingBottom: 4, display: 'flex', alignItems: 'center'}}>
                <Typography style={{flex: 1}} variant="subtitle1">{x.name}</Typography>
                <Select style={{flex: 1}}>
                    <MenuItem>N/A</MenuItem>
                </Select> 
            </div>
        )
    })
    return (
        <div style={{marginTop: 8}}>
            <Typography variant="h6">Adapter Map</Typography>
            {returnType}
        </div>
    )
  }

  React.useEffect(() => {
    let store = getStore();
    client!.actions.getStoreLayout(store.data.label).then((data : any) => {
        console.log(data);
    })
  }, [])

  return (
    <div style={{flex: 1, flexDirection: 'column', display: 'flex'}}>
        <FormControl>
            <InputLabel>Store</InputLabel>
            <Select value={getStore().id}>
                {editor.nodes.filter((a : any) => a.type == 'extStore').map((x : any) => {
                    return <MenuItem value={x.id}>{x.data.label}</MenuItem>
                })}
            </Select>
        </FormControl>
        <FormControl>
            <InputLabel>Model</InputLabel>
            <Select value={getModel().id} onChange={(e) => {
                updateModelLink(e.target.value as string)
            }}>
                {editor.nodes.filter((a: any) => a.type == 'typeDef').map((x: any) => (
                    <MenuItem value={x.id}>{x.data.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl>
            <InputLabel>Store Bucket</InputLabel>
            <Select>
                <MenuItem>vw_Jsis</MenuItem>
            </Select>
        </FormControl>
        {renderFields()}
    </div>
  )
}

export const modal = Modal;

export const node = withEditor((props : any) => {
    return (
    <NodeWrapper {...props}>
      <div style={{padding: 8}} className="ext-adapter">
        {props.id && props.data.label || "External Adapter"}
     </div>
    </NodeWrapper>
    )
})
import React from 'react';

import { Autocomplete } from '@material-ui/lab'
import { NodeWrapper, useEditor, withEditor } from '@workerhive/hive-flow';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useHub } from '@workerhive/client/dist/react';

export const type = 'extAdapter'

const Modal = (props : any) => {

    const client = props.client;
    const editor = props.editor;

    const [ selectedTable, setSelectedTable ] = React.useState<any>();
    const [ tableColumns, setTableColumns ] = React.useState<any>([])

    const [ storeTables, setStoreTables ] = React.useState<any>([])

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
                    {tableColumns.filter((a : any) => {
                       if(x.type === 'String'){
                        return a.datatype == 'nvarchar'
                       } 
                       return true;
                    }).map((column: any) => (
                        <MenuItem value={column.name}>{column.name}</MenuItem>
                    ))}
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
    console.log("Fetch layout", store.data.label)
    client!.actions.getStoreLayout(store.data.label).then((data : any) => {
        console.log(data);
        setStoreTables(data)
    })
  }, [client, getStore])

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
        <Autocomplete
            value={selectedTable}
            onChange={(event, newValue) => {
                setSelectedTable(newValue);
                if(newValue && newValue.name){
                    client!.actions.getBucketLayout(getStore().data.label, newValue.name).then((data: any) => {
                        console.log("BUCKET COLS", data);
                        setTableColumns(data)
                    })
                }
            }}
            options={storeTables}
            getOptionLabel={(option : any) => option.name}
            renderInput={(params) => <TextField {...params} margin="dense" label="Store Bucket" />}
             />
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
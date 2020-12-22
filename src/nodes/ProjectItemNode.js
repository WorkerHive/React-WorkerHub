import React from 'react'

import {
  Autocomplete
} from '@material-ui/lab';

import {
    TextField
} from '@material-ui/core';

import { NodeWrapper, withEditor } from 'react-hive-flow';

import { getColumns, getTables, getViews } from '../actions/adminActions'
import async from 'async';
import moment from 'moment';
import './MSSQLNode.css';

export const type = 'mssqlAdapter'

export const modal = withEditor((props) => {

  const [ tables, setTables ] = React.useState([])

  const [ table, setTable ] = React.useState(null)

  const [ columns, setColumns ] = React.useState([])

  React.useEffect(() => {
    let source = getSource();
    getTables(source.id).then((tables) => {
      setTables(tables)
    })
    console.log(getSource())
  }, [])

  const getSource = () => {
      let links = props.editor.links.filter((a) => a.source == props.node.id)
      if(links && links.length > 0){
        let nodes = links.map((x) => props.editor.nodes.filter((a) => a.id == x.target)[0])
        if(nodes && nodes.length > 0){
            return nodes[0]
        }
      }
  }

  const renderFields = () => {
    let links = props.editor.links.filter((a) => a.target == props.node.id)
    if(links && links.length > 0){
        let nodes = links.map((x) => props.editor.nodes.filter((a) => a.id == x.source)[0])
        if(nodes && nodes.length > 0){
            let type = nodes[0].data.typedef;
            let ret = []
            for(var k in type){
                let changeKey = k
                ret.push(
                <div style={{marginTop: 4, display: 'flex', alignItems: 'center'}}>
                    <div style={{width: 100}}>
                      {k}
                    </div>: 
                    <select 
                      value={props.node && props.node.data && props.node.data.provides && props.node.data.provides[k]}
                      onChange={(e) => {
                    
                        props.editor.updateNode(props.node.id, (node) => {
                          if(!node.data.provides) node.data.provides = {}
                          console.log(e.target.value, " provides ", changeKey)
                          node.data.provides[changeKey] = e.target.value;
                          return node;
                        })
                      }}>
                      {(props.node.data.availableColumns || []).concat([{name: "N/A"}]).map((x) => (
                        <option value={x.name}>
                          {x.name}
                        </option>))}
                      </select>
                </div>
                )
            }
            return ret;
        }
    }
  }

  return (
    <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
        <TextField disabled error={!getSource()} label="Connection Name" value={getSource().data.label}/>

        <Autocomplete 
          value={props.node.data.table}
          onChange={(e, newVal) => {
            console.log(e, newVal)
            if(newVal && newVal.name){
           // setTable(newVal)
              props.editor.updateNode(props.node.id, (node) => {
                node.data.table = newVal;
                return node;
              })
              getColumns(getSource().id, newVal.name).then((r) => {
                console.log("Searching for cols", newVal.name, r)
                props.editor.updateNode(props.node.id, (node) => {
                  node.data.availableColumns = r;
                  node.data.provides = {}
                  return node;
                })
              })
            }
          }}
          options={tables}
          getOptionLabel={(x) => x.name}
          autoHighlight
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="Table" />
          )} />
        <div style={{marginTop: 8}}>
        {renderFields()}
        </div>
    </div>
  )
})

export const node = withEditor((props) => {
    return (
    <NodeWrapper {...props}>
        <textarea 
          onChange={(e) => props.editor.updateNode(props.id, (node) => {return {data: {label: e.target.value}}})}
          value={props.data && props.data.label} 
          rows={4}
          placeholder="Project Title" />
        <div style={{display: 'flex'}}>
            {props.data && props.data.dueDate && "ETA:"} {props.data && moment(new Date(props.data.dueDate * 1000)).format('DD/MM/yyyy')}
        </div>
    </NodeWrapper>
    )
})
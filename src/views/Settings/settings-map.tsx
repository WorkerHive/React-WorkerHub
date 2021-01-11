import { Button, Typography } from '@material-ui/core';
import { CRUDList } from '@workerhive/react-ui';
import React from 'react';


export const SettingsMap = (props: any, storeTypes : any, converters : any, roles: any) => {
  return [
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Add-ons</Typography>,
      body: <CRUDList title={"Add-ons"} data={converters} />
    },
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Connections</Typography>,
      body: (
        <CRUDList 
          title={"Connections"} 
          onDelete={(obj : any) => {
            if(obj && obj.id){
              props.deleteStore(obj.id)
            }
            
          }}
          onSave={(ob : any) => {
            let obj = Object.assign({}, ob)
            if(!obj.id){
              props.addStore(obj)
            }else{
              const id = obj.id;
              delete obj.id;
              console.log("UPDATE STORE", id, obj)

              props.updateStore(id, obj)
            }
          }}
          type={{name: 'String', type: {type: 'Select', items: storeTypes, key: 'id'}, host: 'String', user: 'String', pass: 'Password', dbName: 'String'}} 
          data={props.stores} />
      )
    },
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Roles</Typography>,
      body: <CRUDList title={"Roles"} type={{name: 'String', permissions: {type: 'Table', items: props.types}}} data={roles} />
    },
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Data Flow</Typography>,
      body: (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Typography color="secondary">Warning: changing these settings is dangerous don't enter unless you know what you're doing</Typography>
          <Button variant="contained" color="primary" onClick={() => props.history.push(`/dashboard/admin`)}>Go to editor</Button>
        </div>
      )
    },
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Data types</Typography>,
      body: (
        <CRUDList title={"Types"} type={{name: 'String', def: 'KV'}} data={props.types} 
          onSave={(obj : any) => { 
            console.log(obj) 
          }} />   
      )
    }
  ]
}
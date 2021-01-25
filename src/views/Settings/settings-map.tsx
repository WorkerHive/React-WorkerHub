import { Button, Typography } from '@material-ui/core';
import { CRUDList } from '@workerhive/react-ui';
import { useHub } from '@workerhive/client/dist/react'
import React from 'react';


export const SettingsMap = (props: any, stores: any, storeTypes : any, converters : any, roles: any) => {
  const [ client, store, isReady, err ] = useHub()

  const [ models, setModels ] = React.useState<any>([]);
  React.useEffect(() => {
    client!.getModels().then(models => {
      setModels(models)
    });
  }, [])

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
          onDelete={({item}: any) => {
            if(item && item.id){
              client!.actions.deleteStore(item.id)
            }
            
          }}
          onSave={({item} : any) => {
            let obj = Object.assign({}, item)
            if(!obj.id){
              client!.actions.addStore(obj)
            }else{
              const id = obj.id;
              delete obj.id;
              console.log("UPDATE STORE", id, obj)

              client!.actions.updateStore(id, obj)
            }
          }}
          type={{name: 'String', type: {type: 'Select', items: storeTypes, key: 'id'}, host: 'String', user: 'String', pass: 'Password', dbName: 'String'}} 
          data={store.IntegrationStore} />
      )
    },
    {
      title: <Typography variant="h6" style={{display: 'flex'}}>Roles</Typography>,
      body: <CRUDList title={"Roles"} type={{name: 'String', permissions: {type: 'Table', items: models}}} data={roles} />
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
        <CRUDList title={"Types"} type={{name: 'String', def: 'KV'}} data={models} 
          onEdit={(item: any) => {
            props.history.push(`${props.match.url}/type-editor/${item.name}`)
          }}
          onSave={(obj : any) => { 
            console.log(obj) 
          }} />   
      )
    }
  ]
}
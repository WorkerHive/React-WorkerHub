import React from 'react';

import {
  Paper,
  Divider,
  Typography,
  List,
  IconButton,
  Button,
  ListItem
} from '@material-ui/core';

import { MoreVert } from '@material-ui/icons'

import { CRUDList, AccordionList } from '@workerhive/react-ui'

import { deleteStore, updateStore, addStore, getStoreTypes, getStores } from '../../actions/adminActions';
import { getConverters, installConverter } from '../../actions/fileActions';
import { connect } from 'react-redux';

export interface SettingsProps {
  getStores: Function;
  deleteStore: Function;
  addStore: Function;
  updateStore: Function;
  stores: any;
  history: any;
  types: any;
}

const Settings : React.FC<SettingsProps> = (props) => {

  const [ converters, setConverters ] = React.useState([])
  const [ stores, setStores ] = React.useState([])

  React.useEffect(() => {
    getStoreTypes().then((types : any) => {
      console.log("TYOES", types)
      setStoreTypes(types);
    })

    props.getStores();
  
    /*getConverters().then((converters) => {
      console.log(converters)
      setConverters(converters)
    })*/
  }, [])

  const roles = [
    {
      name: "Admin"
    },
    {
      name: "Editor"
    },
    {
      name: "User"
    }
  ]

  const [ storeTypes, setStoreTypes ] = React.useState([]);

  const settingItems = [
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

  return (
    <div style={{flex: 1, marginTop: 12}}>
      <div style={{display: 'flex', flexDirection: 'column', padding: 8}}>
        <AccordionList items={settingItems} />

        {/*<List>
            {converters.map((x) => (
              <ListItem style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                {x.name}
                {x.installed ? (<Typography>Installed</Typography>): (<Button onClick={() => {
                  installConverter(x.id)
                }} color="primary" variant="contained">Install</Button>)}
              </ListItem>
            ))}
              </List>*/}
    
      </div>
      
    </div>
  );
}

export default connect((state : any) => ({
  types: state.dashboard.types,
  stores: state.admin.stores,
}), (dispatch: any) => ({
  getStores: () => dispatch(getStores()),
  addStore: (store : any) => dispatch(addStore(store)),
  updateStore: (id : any, store : any) => dispatch(updateStore(id, store)),
  deleteStore: (id : any) => dispatch(deleteStore(id))
}))(Settings)
import React from 'react';

import {
  Paper,
  Divider,
  Typography,
  List,
  Button,
  ListItem
} from '@material-ui/core';

import { getConverters, installConverter } from '../../actions/fileActions';

export default function Settings(props){

  const [ converters, setConverters ] = React.useState([])

  React.useEffect(() => {
    getConverters().then((converters) => {
      console.log(converters)
      setConverters(converters)
    })
  }, [])
  const connections = [
    {
      name: "MSSQL Server"
    }
  ]

  return (
    <Paper style={{flex: 1, marginTop: 12}}>
      <div style={{display: 'flex', flexDirection: 'column', padding: 8}}>
        <Typography variant="h6" style={{display: 'flex'}}>Add-ons</Typography>
        <List>
            {converters.map((x) => (
              <ListItem style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                {x.name}
                {x.installed ? (<Typography>Installed</Typography>): (<Button onClick={() => {
                  installConverter(x.id)
                }} color="primary" variant="contained">Install</Button>)}
              </ListItem>
            ))}
        </List>
    
      </div>
      <Divider />
      <div style={{display: 'flex', flexDirection: 'column', padding: 8}}>
        <Typography variant="h6" style={{display: 'flex'}}>Connections</Typography>
        <List>
            {connections.map((x) => (
              <ListItem button>{x.name}</ListItem>
            ))}
        </List>
    
      </div>
      <Divider />
    </Paper>
  );
}

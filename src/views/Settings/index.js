import React from 'react';

import {
  Paper,
  Divider,
  Typography,
  List,
  ListItem
} from '@material-ui/core';

export default function Settings(props){
  const addons = [
    {
      name: "STP to GLB Converter"
    },
    {
      name: "HexNode Replication"
    }
  ]

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
            {addons.map((x) => (
              <ListItem button>{x.name}</ListItem>
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

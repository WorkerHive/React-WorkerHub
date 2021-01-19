import { List, ListItem, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { CRUDKV, Header } from "@workerhive/react-ui"
import './index.css';
import { Add } from '@material-ui/icons';

export interface TypeEditorProps{
    match: any;
}

export const TypeEditor : React.FC<TypeEditorProps> = (props) => {
    const [ type, setType ] = React.useState<any>({def: [{name: 'ID', type: 'ID'}]})
    return (
        <div className="type-editor">
            <Header />
            <div className="type-editor__body">
                <div className="type-editor__details">
                    <Typography variant="h6">{props.match.params.type} </Typography>
                    <div className="type-editor__types">
                        <CRUDKV types={[{name: "String"}]} value={type.def} onChange={(def : any) => {console.log("Hit"); setType({def: def});}} />
                    </div>

                    <Paper className="type-editor__views">
                        <Typography variant="subtitle1">Views</Typography>
                        <List>
                            <ListItem button>{props.match.params.type} Home</ListItem>
                            <ListItem button style={{display: 'flex', justifyContent: 'center'}}><Add /> Create new page</ListItem>
                        </List>
                    </Paper>
                </div>
                <Paper className="type-editor__integrations">
                    <Typography variant="subtitle1">Integrations</Typography>
                    <List>
                        <ListItem button style={{display: 'flex', justifyContent: 'center'}}><Add /> Add Integration</ListItem>
                    </List>
                </Paper>
            </div>
        </div>
    )
}
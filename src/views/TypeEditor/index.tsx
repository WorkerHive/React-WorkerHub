import { IconButton, List, ListItem, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { CRUDKV, Header } from "@workerhive/react-ui"
import './index.css';
import { Add, ArrowBack } from '@material-ui/icons';
import { useHub } from '@workerhive/client';

export interface TypeEditorProps{
    match: any;
    history: any;
}

export const TypeEditor : React.FC<TypeEditorProps> = (props) => {
    const [ type, setType ] = React.useState<any>({def: [{name: 'ID', type: 'ID'}]})

    const [ client, isReady, err ] = useHub();

    const editPage = (page : string) => {
        props.history.push(`${props.match.url}/pages/${page}`)
    }

    React.useEffect(() => {
        if(isReady && client){
            setType({def: client.models!.filter((a) => a.name === props.match.params.type)[0].def})
        }
    }, [])

    return (
        <div className="type-editor">
            <Header title={props.match.params.type}/>
            <div className="type-editor__body">
                <div className="type-editor__details">
                    {/*<div style={{display: 'flex', alignItems: 'center'}}>
                        <IconButton onClick={() => props.history.push(`/dashboard/settings`)}><ArrowBack /></IconButton><Typography variant="h6">{props.match.params.type} </Typography>
                    </div>*/}
                    
                    <Paper className="type-editor__types">
                        <CRUDKV types={client!.models || []} value={type.def} onChange={(def : any) => {console.log("Hit"); setType({def: def});}} />
                    </Paper>

                    <Paper className="type-editor__views">
                        <Typography variant="subtitle1">Views</Typography>
                        <List>
                            <ListItem button onClick={() => editPage('default')}>{props.match.params.type} Home</ListItem>
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
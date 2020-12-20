import React from 'react';

import {
    Add
} from '@material-ui/icons';

import {
    Fab,
    List,
    ListItem
} from '@material-ui/core';

import { useMutation } from '@apollo/client';
import { attachFile } from '../../actions/fileActions';
import FileDialog from '../../components/file-dialog';

export default function FileTab(props){
    const [ dialogOpen, openDialog ] = React.useState(false)

    React.useEffect(() => {
        console.log(props.project)
    })
    return (
        <div>
            <List>
                {props.project && props.project.files && props.project.files.map((x) => (
                    <ListItem>{x.filename}</ListItem>
                ))}
            </List>
            <FileDialog onAttach={(selected) => {
                for(var k in selected){
                    attachFile(props.project.id, k);
                    
                }
    
            }} open={dialogOpen} onClose={() => openDialog(false)} />
            <Fab style={{position: 'absolute', bottom: 12, right: 12}} color="primary" onClick={() => openDialog(true)}>
                <Add />
            </Fab>

        </div>
    )
}
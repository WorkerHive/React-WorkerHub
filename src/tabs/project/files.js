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
import { YContext } from '../../graph/yjs';

import FileBrowser from '../../components/file-browser';
import { attachFile } from '../../actions/fileActions';
import FileDialog from '../../components/dialogs/file-dialog';

export default function FileTab(props){

    const [ dialogOpen, openDialog ] = React.useState(false)
    const [ files, setFiles ] = React.useState([])

    React.useEffect(() => {
        if(props.y){
            console.log("Y", props.y.toJSON())
            setFiles(props.y.toJSON()['attachments'] || [])
        }
    }, [props.y])

    return (
        <div style={{flex: 1, display: 'flex', position: 'relative'}}>
            <FileBrowser title={props.project.name} files={files}/>
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
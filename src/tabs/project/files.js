import React from 'react';

import {
    Add
} from '@material-ui/icons';

import {
    Fab
} from '@material-ui/core';

import { useMutation } from '@apollo/client';
import { ATTACH_FILE } from '../../actions/fileActions';
import FileDialog from '../../components/file-dialog';

export default function FileTab(props){
    const [ dialogOpen, openDialog ] = React.useState(false)
    const [ attachFiles, ] = useMutation(ATTACH_FILE)
    return (
        <div>
            <FileDialog onAttach={(selected) => {
                for(var k in selected){
                    attachFiles({variables: {
                        projectId: props.project.id,
                        fileId: k
                    }})
                }
               
    
            }} open={dialogOpen} onClose={() => openDialog(false)} />
            <Fab style={{position: 'absolute', bottom: 12, right: 12}} color="primary" onClick={() => openDialog(true)}>
                <Add />
            </Fab>

        </div>
    )
}
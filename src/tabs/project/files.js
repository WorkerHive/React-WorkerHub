import React from 'react';

import {
    Add
} from '@material-ui/icons';

import {
    Fab
} from '@material-ui/core';
import FileDialog from '../../components/file-dialog';

export default function FileTab(props){
    const [ dialogOpen, openDialog ] = React.useState(false)
    return (
        <div>
            <FileDialog open={dialogOpen} onClose={() => openDialog(false)} />
            <Fab style={{position: 'absolute', bottom: 12, right: 12}} color="primary" onClick={() => openDialog(true)}>
                <Add />
            </Fab>

        </div>
    )
}
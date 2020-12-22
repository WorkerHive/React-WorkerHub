import React from 'react';

import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    TextField,
    Button
} from '@material-ui/core'

export default function FolderDialog(props){
    const [ name, setName ] = React.useState('')
    
    const addFolder = () => {
        if(props.onAdd) props.onAdd(name)
        setName('')
        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Folder</DialogTitle>
            <DialogContent>
                <TextField 
                    onKeyDown={(e) => {
                        if(e.keyCode == 13){
                            addFolder()
                        }
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Folder name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClick}>Cancel</Button>
                <Button onClick={addFolder} color="primary" variant="contained">Create</Button>
            </DialogActions>
        </Dialog>
    )
}
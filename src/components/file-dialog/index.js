import React from 'react';

import {
    Search
} from '@material-ui/icons';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    Button,
    InputAdornment,
    TextField,
    Checkbox
} from '@material-ui/core';

import { connect } from 'react-redux';

function FileDialog(props){
    const [ search, setSearch ] = React.useState('')

    const [ selectedFiles, setSelected ] = React.useState({})

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>Files</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    label="Search" 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                    }} />
                <List>
                    {props.files.filter((a) => a.filename && a.filename.toLowerCase().indexOf(search.toLowerCase()) > -1).map((x) => (
                        <ListItem button><Checkbox checked={selectedFiles[x.id]} onChange={(e) => {
                            let files = selectedFiles;
                            files[x.id] = e.target.checked;
                            setSelected(files)
                        }}/>{x.filename}</ListItem>
                    ))}    
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
                <Button color="primary" variant="contained">Attach</Button>
            </DialogActions>

        </Dialog>
    )
}

export default connect((state) => ({
    files: state.files.list
}))(FileDialog)
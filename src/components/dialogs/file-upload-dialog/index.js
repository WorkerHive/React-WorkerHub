import React from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ListItem,
    List,
    IconButton
} from '@material-ui/core';

import {
    Clear,
    Backup
} from '@material-ui/icons';
import Spinner from 'react-spinkit';
import { uploadFile } from '../../../actions/fileActions'
import { connect } from 'react-redux';
import async from 'async';
import { v4 as uuidv4 } from 'uuid';
import {useDropzone} from 'react-dropzone'

function FileUploadDialog(props){
    const [ files, setFiles ] = React.useState([])
    const [ upload, setUpload ] = React.useState(false)
    const [uploading, setUploading] = React.useState({});

    const onDrop = React.useCallback(async (acceptedFiles) => {
        console.log(acceptedFiles)
        if(acceptedFiles && acceptedFiles.length > 0){
            setFiles(files.concat(acceptedFiles.map((x) => ({
                file: x,
                id: uuidv4()
            }))))
            
         
        }
        // Do something with the files
      }, [files])
    
    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    const uploadAction = () => {
        setUpload(true)
        async.each(files, (item, cb) => {
            let u = Object.assign({}, uploading)
            u[item.id] = true;
            console.log("Uploading", uploading)
            setUploading(u)
            props.uploadFile(item.file, () => {
                u = Object.assign({}, uploading)
                console.log("Finished uploading")
                u[item.id] = false;
                setUploading(u)
                cb()
            })
        }, (err) => {
            setUpload(false)
            setFiles([])
            props.onClose()
        })
    }

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogContent>
                <div style={{
                    minHeight: 100,
                    maxHeight: 200,
                    overflowY: 'scroll',
                    borderRadius: 7,
                    padding: 8,
                    border: `1px dashed ${isDragActive ? 'blue' : 'gray'}`
                }} {...getRootProps()}>
                    <input {...getInputProps()}></input>
                    <List>
                        {files.length > 0 ? files.map((x, ix) => (
                            <ListItem style={{display: 'flex', justifyContent: 'space-between'}}>
                               <div style={{display: 'flex', alignItems: 'center'}}>
                               {uploading[x.id] && <Spinner name="double-bounce" />}
                                {x.file.name}
                               </div>
                                <IconButton onClick={(evt) => {
                                    evt.stopPropagation()
                                    let f = files.slice()
                                    f.splice(ix, 1)
                                    setFiles(f)
                                }}>
                                    <Clear />
                                </IconButton>
                            </ListItem>
                        )) : (
                            <div style={{flexDirection: 'column', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Backup style={{fontSize: 44}}/>
                                <span>Drop your files here</span>
                            </div>
                        )}

                    </List>
                    
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={upload} onClick={uploadAction} color="primary" variant="contained">Upload</Button>
            </DialogActions>
        </Dialog>
    )
}

export default connect(null, (dispatch) => ({
    uploadFile: (file, cb) => dispatch(uploadFile(file, cb))
}))(FileUploadDialog)
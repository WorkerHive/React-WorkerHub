import React from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';

import GLBCard from '../../glb-card'
import PDFCard from '../../pdf-card';

import { connect } from 'react-redux';
import { withIPFS } from '../../../graph/ipfs';

function FilePreviewDialog(props){

    const file = props.file || {}
    const [data, setData] = React.useState(null)

    const renderContent = () => {
        if(data){
        switch(file.extension){
            case 'pdf':
                return (
                    <PDFCard data={data}/>
                )
            case 'glb':
                return (
                    <GLBCard data={data}/>
                )
            case 'png':
                return (
                    <img style={{width: '33%', height: '100%'}} src={data} />
                )
            default:
                return null;
        }
    }
    }

    React.useEffect( async () => {
        if(data) URL.revokeObjectURL(data)

        if(props.file && props.ipfs && props.ipfs.isReady){
            console.log("Fetching", props.file.cid)
            let file =  props.ipfs.node.cat(props.file.cid)
            let data = Buffer.from('')
            for await (const chunk of file){
              data = Buffer.concat([data, chunk])
            }
            console.log("Setting data")
            setData(URL.createObjectURL(new Blob([data])))
        }
    }, [props.file, props.ipfs])

    const onClose = () => {
        if(data) URL.revokeObjectURL(data)
        if(props.onClose) props.onClose();
    }

    return (
        <Dialog fullWidth maxWidth="lg" open={props.open} onClose={onClose}>
            <DialogTitle>{file.filename}</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default withIPFS(FilePreviewDialog)
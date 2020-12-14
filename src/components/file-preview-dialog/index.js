import React from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';

import PDFCard from '../pdf-card';

export default function FilePreviewDialog(props){

    const file = props.file || {}

    const renderContent = () => {
        switch(file.extension){
            case 'pdf':
                return (
                    <PDFCard file={{data:file.content}}/>
                )
            default:
                return null;
        }
    }

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>{file.name}</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
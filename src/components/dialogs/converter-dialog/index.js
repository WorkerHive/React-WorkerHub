import React from 'react';

import {
    Forward
} from '@material-ui/icons'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@material-ui/core';

import { getConverters, convertFile } from '../../../actions/fileActions';

export default function ConverterDialog(props){
    const [ outputFormat, setOutputFormat ] = React.useState('')

    const [ formats, setFormats ] = React.useState([])

    React.useEffect(() => {
        getConverters().then((converters) => {
            setFormats(converters.map((x) => ({
                from: x.sourceFormat,
                to: [x.targetFormat]
            })))
        })
    }, [])

    const convert = () => {
        convertFile(props.selected.id, outputFormat.toLowerCase())
        props.onClose();
        setOutputFormat('')
        
    }

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>Convert {props.selected && props.selected.filename}</DialogTitle>
            <DialogContent style={{display: 'flex', alignItems: 'center'}}>
                <TextField 
                    fullWidth 
                    disabled
                    label="From" 
                    value={props.selected && props.selected.extension.toUpperCase()}/>
                <Forward style={{marginLeft: 8, marginRight: 8}}/>
                <FormControl fullWidth>
                    <InputLabel>To</InputLabel>
                    <Select value={outputFormat} onChange={(e) => {
                        setOutputFormat(e.target.value) 
                    }} fullWidth>
                        {props.selected && (formats.filter((a) => a.from == props.selected.extension)[0] || {to: []}).to.map((x) => (
                            <MenuItem value={x}>{x.toUpperCase()}</MenuItem>

                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={convert} color="primary" variant="contained">Start</Button>
            </DialogActions>
        </Dialog>
    )
}
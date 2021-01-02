import React from 'react';

import {
    Dialog,
    DialogTitle,
    TextField,
    Button,
    DialogContent,
    DialogActions
} from '@material-ui/core'

/*
    Mutable Dialog

    title: String

    structure: {
        key: type
    }
*/

export default function MutableDialog(props){
    
    const [data, setData] = React.useState({})

    React.useEffect(() => {
        if(props.data && props.data != data){
            setData(props.data)
        }
    }, [props.data])
    
    const onClose = () => {
        setData({})
        if(props.onClose) props.onClose();
    }

    const onSave = () => {
        if(props.onSave) props.onSave(data)
    }

    const renderItem = (key, type) => {
        switch(type){
            case 'String':
                return (
                    <TextField 
                        value={data[key] || ''}
                        onChange={(e) => {
                            let d = Object.assign({}, data)
                            d[key] = e.target.value;
                            setData(d)
                        }}
                        margin="normal" 
                        label={uppercase(key)} />
                )
            default:
                return null;        
        }
    }

    const uppercase = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const renderStructure = () => {
        let struct = [];
        
        for(var k in props.structure){
            struct.push(renderItem(k, props.structure[k]))
        }
        return struct;
    }

    return (
        <Dialog 
            fullWidth
            open={props.open} 
            onClose={onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                {renderStructure()}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={onSave}
                    color="primary" 
                    variant="contained">Enter</Button>
            </DialogActions>
        </Dialog>
    )
}
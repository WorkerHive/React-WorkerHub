import React from 'react';

import {
    Add
} from '@material-ui/icons';

import {
    Fab,
    Dialog,
    DialogTitle,
    TextField,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    DialogContent
} from '@material-ui/core';

import './index.css';

export default function PermissionForm(props){
    const [dialogOpen, openDialog] = React.useState(false)

    const [ changes, setChanges ] = React.useState({})
    const [ dataObj, setDataObj ] = React.useState({})

    const permissions = props.permissions && props.permissions[0] || {}
    const type = props.type && props.type[0] || {}

    React.useEffect(() => {
        if(props.selected){
            setDataObj(props.selected)
        }
    }, [props.selected])

    const renderFields = (type) => {
        let fields = [];
    
        for(var k in type.typeDef){
            const typeKey = k;
            switch(type.typeDef[k]){
                case "String":
                fields.push((
                    <TextField value={dataObj[typeKey]} onChange={(e) => {
                        let d = Object.assign({}, dataObj);
                        let changed = Object.assign({}, changes)
                        d[typeKey] = e.target.value;
                        changed[typeKey] = e.target.value;
                        setDataObj(d)
                        setChanges(changed)
                    }} label={typeKey} ></TextField>
                ))
                break;
                case "Boolean":
                    fields.push((
                        <FormControlLabel
                            control={(
                                <Checkbox checked={dataObj[typeKey]} onChange={(e) => {
                                    let d = Object.assign({}, dataObj)
                                    let changed = Object.assign({}, changes)
                                    d[typeKey] = e.target.checked;
                                    changed[typeKey] = e.target.checked;
                                    setDataObj(d)
                                    setChanges(changed)
                                }}/>
                            )}
                            label={typeKey} />

                    ))
            }
        }
        return fields;
    }

    const onClose = () => {
        props.onClose()
        openDialog(false)
        setDataObj({})
    }

    const onSave = () => {
        props.onSave(dataObj, changes)
        onClose();
    }

    return (
        <div className="permission-form">
            <Dialog fullWidth open={props.selected || dialogOpen} onClose={() => {
               onClose()
            }}>
                <DialogTitle>{type.name}</DialogTitle>
                <DialogContent style={{display: 'flex', flexDirection: "column"}}>
                    {renderFields(type)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {onClose()}}>Cancel</Button>
                    <Button onClick={() => onSave()} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
            <div className="permission-form__inner">
                {props.children}
            </div>
            {permissions.create && (
                <Fab onClick={() => openDialog(true)} color="primary" style={{position: 'absolute', bottom: 12, right: 12}}>
                    <Add />
                </Fab>
            )}
        </div>
    )
}
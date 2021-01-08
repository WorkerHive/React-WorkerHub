import React from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@material-ui/core"

import RWTable from "../../rw-table"
import { connect } from 'react-redux';

function RoleDialog(props){

    const [ data, setData ] = React.useState({});

    React.useEffect(() => {
        if(props.data){
            setData(props.data)
        }
    }, [props.data])

    const saveRole = () => {
        console.log(data);
    }

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>Roles</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                <TextField fullWidth onChange={(e) => {
                    let d = Object.assign({}, data)
                    d['name'] = e.target.value;
                    setData(d)
                }} value={data['name']} label="Role Title" />
                

                <RWTable items={props.types} value={data['permissions'] || {}} onChange={(permissions) => {
                    let d = Object.assign({}, data);
                    d['permissions'] = permissions
                    setData(d)
                }}/>

            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button color="primary" variant="contained" onClick={saveRole}>Save</Button>
            </DialogActions>
        </Dialog>

    )
}

export default connect((state) => ({
    types: state.dashboard.types
}))(RoleDialog)
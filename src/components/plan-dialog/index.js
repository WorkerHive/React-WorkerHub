import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    Button
} from '@material-ui/core';

import { KeyboardDateTimePicker } from '@material-ui/pickers'
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import moment from 'moment';

import './index.css';

function PlanDialog(props){
    const [ ID, setID ] = React.useState('')
    const [ title, setTitle ] = React.useState('')
    const [ description, setDescription ] = React.useState('')
    const [ dueDate, setDueDate ] = React.useState(null);
    const [ members, setMembers ] = React.useState([])

    React.useEffect(() => {
        if(props.plan){
            setID(props.plan.id)
            setTitle(props.plan.title)
            setDescription(props.plan.description)
            setMembers(props.plan.members || [])
            if(props.plan.dueDate) setDueDate(moment(new Date(props.plan.dueDate * 1000)))
        }
    }, [props.plan])

    const onSave = () => {
        let plan = {
            id: ID,
            title: title,
            description: description,
            dueDate: dueDate && dueDate.valueOf() / 1000,
            members: members
        }

        if(props.onSave){
            props.onSave(plan)
            props.onClose();
        }
    }

    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>
                <TextField value={title} onChange={(e) => setTitle(e.target.value)} fullWidth label="Title" />
            </DialogTitle>
            <DialogContent className="plan-dialog__content">
                <div className="plan-info">
                    <TextField 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth 
                        label="Description" 
                        rows={3} multiline rowsMax={6} />

                </div>
                <div className="plan-actions">
                    <Button 
                        onClick={() => {
                            let m = members.slice();
                            if(members.indexOf(props.user.id) > -1){
                                m.splice(members.indexOf(props.user.id), 1)
                            }else{
                                m.push(props.user.id)
                            }
                            setMembers(m)
                        }}
                        color={members.indexOf(props.user.id) > -1 ? "" : "primary"}
                        variant="contained">{members.indexOf(props.user.id) > -1 ? "Leave" : "Join"}</Button>
                    <Button color="primary" variant="contained">Members</Button>
                    <KeyboardDateTimePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(e) => {
                            setDueDate(e)
                        }}
                        format={"DD/MM/yyyy"} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={onSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default connect((state) => ({
    user: jwt_decode(state.auth.token)
}))(PlanDialog)
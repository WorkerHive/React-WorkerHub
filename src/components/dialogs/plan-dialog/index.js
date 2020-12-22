import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    Button,
    Typography,
    Menu,
    MenuItem,
    List,
    ListItem,
    Divider
} from '@material-ui/core';

import {
    Check
} from '@material-ui/icons';

import FileDrop from '../../file-drop';
import { KeyboardDateTimePicker } from '@material-ui/pickers'
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux'
import { withEditor } from 'react-hive-flow';
import { attachFile, uploadFile } from '../../../actions/fileActions';
import moment from 'moment';

import './index.css';

function PlanDialog(props){
    const [ ID, setID ] = React.useState('')
    const [ title, setTitle ] = React.useState('')
    const [ description, setDescription ] = React.useState('')
    const [ dueDate, setDueDate ] = React.useState(null);
    const [ members, setMembers ] = React.useState([])
    const [ attachments, setAttachments ] = React.useState([])

    const [ memberAnchor, setMemberAnchor ] = React.useState(null);

    React.useEffect(() => {
        if(props.plan){
            setID(props.plan.id)
            setTitle(props.plan.title)
            setDescription(props.plan.description)
            setMembers(props.plan.members || [])
            setAttachments(props.plan.attachments || [])
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

    const addFilesToPlan = (files) => {
        if(files.length > 0){
            for(var i = 0; i < files.length; i++){
                props.uploadFile(files[i], (newFile) => {
                    props.editor.attachFile(newFile.filename, newFile.cid)
                    props.editor.updateNode(ID, (node) => {
                        return {data: {
                            attachments: (node.data.attachments || []).concat([{name: newFile.filename, cid: newFile.cid}])
                        }}
                    })
                    setAttachments(attachments.concat([{
                        name: newFile.filename,
                        cid: newFile.cid
                    }]))
                })
            }
            console.log(files)
        }
    }

    const toggleMembersMenu = (e) => {

        setMemberAnchor(!memberAnchor ? e.currentTarget : null)

    }

    return (

        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <FileDrop onDrop={addFilesToPlan} noClick>
            {(isDragActive) => (
                <>
            <div>{isDragActive && (
                <div style={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 0,
                    zIndex: 9,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }} className="file-opacity">
                    <Typography variant="h6" style={{fontWeight: 'bold'}}>Drop files here</Typography>
                </div>
            )}</div>
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
                        rows={4} multiline rowsMax={6} />
                    
                    <div>
                        <Typography style={{fontWeight: 'bold', marginTop: 4}} variant="subtitle1">Attachments</Typography>
                        {attachments.map((x) => (
                            <div>{x.name}</div>
                        ))}
                    </div>

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
                    <Button color="primary" variant="contained" onClick={(e) => {
                        toggleMembersMenu(e);
                    }}>Members</Button>
                    <Menu 
                        onClose={() => setMemberAnchor(null)}
                        transformOrigin={{vertical: 'top', horizontal: 'center'}}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        open={memberAnchor} 
                        anchorEl={memberAnchor}>
                            <Divider />
                        <div style={{padding: 4}}>
                        <TextField label="Name" />
                        </div>
                        <List>
                            {props.team.map((x) => (
                                <ListItem button onClick={() => {
                                    props.editor.updateNode(ID, (node) => {
                                        let mem = node.members;
                                        if(mem.indexOf(x.id) > -1){
                                            mem.splice(mem.indexOf(x.id), 1)
                                        }else{
                                            mem.push(x.id)
                                        }
                                        return {
                                            members: mem
                                        }
                                    })
                                }}>{members.indexOf(x.id) > -1 && <Check style={{marginRight: 8}}/>} {x.name}</ListItem>
                            ))}
                        </List>
                        
                    </Menu>
                    <KeyboardDateTimePicker
                        style={{marginTop: 4}}
                        label="Due Date"
                        value={dueDate}
                        onChange={(e) => {
                            setDueDate(e)
                        }}
                        format={"DD/MM/yyyy"} />
                    <Button color="primary" variant="contained" style={{marginTop: 4}}>Attachments</Button>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={onSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
            </>
            )}
        </FileDrop>
        </Dialog>
    );
}

export default connect((state) => ({
    user: jwt_decode(state.auth.token),
    team: state.team.list,
}), (dispatch) => ({
    uploadFile: (file, cb) => dispatch(uploadFile(file, cb))
}))(withEditor(PlanDialog))
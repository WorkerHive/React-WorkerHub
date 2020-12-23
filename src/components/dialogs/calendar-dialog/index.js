import React from 'react';
import * as Y from 'yjs'
import { 
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    List,
    ListItem,
    Divider
} from '@material-ui/core'

import {
    Autocomplete
} from '@material-ui/lab'

import {
    Search
} from '@material-ui/icons';

import { useMutation } from '@apollo/client';
import { addBooking } from '../../../actions/calendarActions';
import { setStatus } from '../../../actions/authActions';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { connect } from 'react-redux';
import {YContext} from '../../../graph/yjs';

import moment from 'moment';

let yDoc; 

function CalendarDialog(props){
    const {ydoc} = React.useContext(YContext)
    const [ step, setStep ] = React.useState(0)
    const [ searchTab, setSearchTab ] = React.useState(0)
    const [ search, setSearch ] = React.useState(null)

    const [ date, setDate ] = React.useState(null);
    const [ allDay, setAllDay ] = React.useState(false);
    const [ startTime, setStart ] = React.useState(null)
    const [ endTime, setEnd ] = React.useState(null)
    const [ project, setProject ] = React.useState(null)

    const [ selectedItems, setSelectedItems ] = React.useState({})

    React.useEffect(() => {
       yDoc = ydoc.getMap('calendar')    
    }, [])

    const stepButton = () => {
        if(step == 0){
            setStep(1)
        }else{
            //Book items
            let equipment = [];
            let team = [];

            for(var k in selectedItems){
                if(selectedItems[k].selected){
                    switch(selectedItems[k].type){
                        case 'team':
                            team.push(k)
                            break
                        case 'equipment':
                            equipment.push(k)
                            break;
                    }
                }
            }

            let sTime, eTime;
            if(startTime){
                sTime = moment(date)
                sTime.set('hour', startTime.get('hour'))
                sTime.set('minute', startTime.get('minute'))

            }
            if(endTime){
                eTime = moment(date)
            
                eTime.set('hour', endTime.get('hour'))
                eTime.set('minute', endTime.get('minute'))
            }


            let booking = new Y.Map();
            let _booking = {
                date: date.valueOf() / 1000,
                project: project,
                startTime: sTime && parseInt(sTime.valueOf() / 1000),
                endTime: eTime && parseInt(eTime.valueOf() / 1000),
                allDay: allDay,
                items: {
                    team: team,
                    equipment: equipment
                }
            }
            
            booking.set('date', _booking.date)
            booking.set('project', _booking.project)

            if(yDoc){
                //yDoc.set('bookings', [])
                console.log("Inserting into yjs")
                let obj = yDoc.toJSON()
                let bookings = obj.bookings || [];
                console.log(bookings)
                bookings.push(_booking)
                yDoc.set('bookings', bookings)
                console.log(yDoc.toJSON())
            }

            

            /*props.addBooking({
                    allDay: allDay,
                    startTime: startTime && parseInt(sTime.valueOf() / 1000),
                    endTime: endTime && parseInt(eTime.valueOf() / 1000),
                    date: date.valueOf() / 1000
                },
                project.id,
                {
                    equipment: equipment,
                    team: team
                })*/
                props.onClose()
        }
    }

    
    const renderStep = () => {
        switch(step){
            case 0:
                return (
                <>
                <Autocomplete 
                    value={project}
                    onChange={(e, newVal) => setProject(newVal)}
                    options={props.projects}
                    getOptionLabel={(project) => project.name} 
                    renderInput={(params) => {
                        return (
                            <TextField {...params} label="Project"  />
                        )
                    }}/>
                <KeyboardDatePicker 
                    value={date}
                    format="DD/MM/yyyy"
                    onChange={(e, newVal) => setDate(e)}
                    margin="normal" 
                    label="Date" 
                    variant="inline" ></KeyboardDatePicker>
                <FormControlLabel 
                    control={<Checkbox checked={allDay} onChange={(e) => {
                        setAllDay(e.target.checked)
                    }}/>}
                    label="All day" />
                {!allDay && <div style={{display: 'flex', marginTop: 8}}>
                    <KeyboardTimePicker 
                        value={startTime}
                        onChange={(e) => setStart(e)}
                        label="Start Time"
                        fullWidth 
                        style={{marginRight: 4}} 
                        variant="inline" ></KeyboardTimePicker>
                    <KeyboardTimePicker 
                        value={endTime}
                        onChange={(e) => setEnd(e)}
                        label="End Time"
                        fullWidth 
                        style={{marginLeft: 4}} 
                        variant="inline" ></KeyboardTimePicker>
                </div>}
                </>
                )
            case 1:
                return (
                    
                        <List>
                            {(searchTab == 0 ? props.team : props.equipment).filter((a) => !search || a.name.toLowerCase().indexOf(search.toLowerCase()) > -1).map((x) => (
                                <ListItem>
                                    <Checkbox checked={selectedItems[x.id] && selectedItems[x.id].selected || false} onChange={(e) => {
                                        let s = Object.assign({}, selectedItems);
                                        s[x.id] = {
                                            selected: e.target.checked,
                                            type: searchTab == 0 ? "team" :"equipment"
                                        } 
                                        console.log(s)
                                        setSelectedItems(s)  
                                    }}/>
                                    {x.name}
                                </ListItem>
                            ))}
                        </List>
                    
                )
            default:
                return null;
        }
    }

    const renderStepTitle = () => {
        switch(step){
            case 1:
                return (
                    <>
                    <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} fullWidth InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment> 
                    }} label="Search" />
                    <Tabs value={searchTab} onChange={(e, newVal) => {
                        if(newVal !== searchTab) setSearch('')
                        setSearchTab(newVal)
                    }}>
                        <Tab label="Team" />
                        <Tab label="Equipment" />
                    </Tabs>
                    <Divider />
                    
                    </>
                )
            case 0:
                return "Create a booking"
            default:
                return null
        }
    }
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose}>
            <DialogTitle>
                {renderStepTitle()}</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column', minHeight: 250}}>
                {renderStep()}
            </DialogContent>
            <DialogActions>
                <Button onClick={step == "0" ? props.onClose : () => setStep(0)}>{step == "0" ? "Cancel" : "Back"}</Button>
                <Button color="primary" onClick={stepButton} variant="contained">{step == "1" ? "Book" : "Next"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default connect((state) => ({
    projects: state.projects.list,
    team: state.team.list,
    equipment: state.equipment.list
}), (dispatch) => ({
    addBooking: (time, project, booking) => dispatch(addBooking(time, project, booking)),
    setStatus: (status) => dispatch(setStatus(status))
}))(CalendarDialog)
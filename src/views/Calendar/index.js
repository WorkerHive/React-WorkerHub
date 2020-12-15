import React from 'react';
import {
    Paper,
    Fab
} from '@material-ui/core';

import {
    Add
} from '@material-ui/icons';

import DashboardHeader from '../../components/dashboard-header'
import CalendarDialog from '../../components/calendar-dialog'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { getBookings } from '../../actions/calendarActions';
import { connect } from 'react-redux';
import YActions from '../../graph/yjs';
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)
const doc = YActions();

let yDoc;

function CalendarView(props){
    const [ dialogOpen, openDialog ] = React.useState(false)
    const [ bookings, setBookings ] = React.useState([])

    const myEventsList = [];

    const tabs = ["All", "Me", "Projects"];
    
    const observer = () => {
        let obj = yDoc.toJSON()
        if(obj.bookings && obj.bookings.length > 0){
            setBookings(obj.bookings)
        }
    }
    React.useEffect(() => {
        yDoc = doc.getMap('calendar')
        yDoc.observe(observer)
        
        let obj = yDoc.toJSON()
        if(obj.bookings && obj.bookings.length > 0){
            setBookings(obj.bookings)
        }
       // props.getBookings()
    }, [])

    return [
        <DashboardHeader 
        tabs={tabs}
        selectedTab={""}
        onTabSelect={(tab) => {
            //setSelectedTab(tab)
            props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
        }}
        title={"Calendar"} />,
        <CalendarDialog y={yDoc} open={dialogOpen} onClose={() => openDialog(false)} />,
        
        <Paper style={{
            position: 'relative',
            marginTop: 12, 
            height: 'calc(100vh - 84px)', 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            padding: 4}}>
            <Fab onClick={() => openDialog(true)} color="primary" style={{zIndex: 9, position: 'absolute', right: 12, bottom: 12}}>
                <Add />
            </Fab>
            <Calendar
                localizer={localizer}
                events={bookings.map((x) => ({
                    id: x.id,
                    title: x.project.name,
                    allDay: x.allDay,
                    start: new Date((x.startTime || x.date)*1000),
                    end: new Date((x.endTime || x.date)* 1000)
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ flex: 1 }} />
        </Paper>
    ]
}

export default connect((state) => ({
    bookings: state.calendar.bookings
}), (dispatch) => ({
    getBookings: () => dispatch(getBookings())
}))(CalendarView)
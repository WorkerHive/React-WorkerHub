import React from 'react';
import {
    Paper,
    Fab
} from '@material-ui/core';

import {
    Add
} from '@material-ui/icons';

import { Header } from '@workerhive/react-ui'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { getBookings } from '../../actions/calendarActions';
import { connect } from 'react-redux';
import { setStatus } from '../../actions/authActions'
import { YContext } from '../../graph/yjs';
import 'react-big-calendar/lib/css/react-big-calendar.css'

const CalendarDialog = require('../../components/dialogs/calendar-dialog')

const localizer = momentLocalizer(moment)

let yDoc : any;

export interface CalendarViewProps {
    history: any;
    match: any;
}

const CalendarView: React.FC<CalendarViewProps> = (props) => {
    const { ydoc } = React.useContext(YContext);

    const [dialogOpen, openDialog] = React.useState(false)
    const [bookings, setBookings] = React.useState([])

    const tabs = ["All", "Me", "Projects"];

    const observer = () => {
        let obj = yDoc.toJSON()
        if (obj.bookings && obj.bookings.length > 0) {
            setBookings(obj.bookings)
        }
    }
    React.useEffect(() => {
        yDoc = ydoc.getMap('calendar')
        yDoc.observe(observer)

        let obj = yDoc.toJSON()
        if (obj.bookings && obj.bookings.length > 0) {
            setBookings(obj.bookings)
        }
        // props.getBookings()
    }, [])

    return (
        <>
            <Header
                tabs={tabs}
                selectedTab={""}
                onTabSelect={(tab: string) => {
                    //setSelectedTab(tab)
                    props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
                }}
                title={"Calendar"} />
            <CalendarDialog y={yDoc} open={dialogOpen} onClose={() => openDialog(false)} />

            <Paper style={{
                position: 'relative',
                marginTop: 12,
                height: 'calc(100vh - 84px)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 4
            }}>
                <Fab onClick={() => openDialog(true)} color="primary" style={{ zIndex: 9, position: 'absolute', right: 12, bottom: 12 }}>
                    <Add />
                </Fab>
                <Calendar
                    localizer={localizer}
                    events={bookings.map((x: any) => ({
                        id: x.id,
                        title: x.project.name,
                        allDay: x.allDay,
                        start: new Date((x.startTime || x.date) * 1000),
                        end: new Date((x.endTime || x.date) * 1000)
                    }))}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }} />
            </Paper>
        </>
    )
}

export default connect((state: any) => ({
    bookings: state.calendar.bookings
}), (dispatch: any) => ({
    getBookings: () => dispatch(getBookings()),
    setStatus: (status: string) => dispatch(setStatus(status))
}))(CalendarView)
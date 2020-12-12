import React from 'react';
import {
    Paper
} from '@material-ui/core';
import DashboardHeader from '../../components/dashboard-header'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
const localizer = momentLocalizer(moment)

export default function CalendarView(props){
    const myEventsList = [];

    const tabs = [];

    return [
        <DashboardHeader 
        tabs={tabs}
        selectedTab={""}
        onTabSelect={(tab) => {
            //setSelectedTab(tab)
            props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
        }}
        title={"Calendar"} />,
    
        <Paper style={{marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', padding: 4}}>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ flex: 1 }} />
        </Paper>
    ]
}
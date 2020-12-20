import React from 'react';
import jwt_decode from 'jwt-decode';

import {
    Notifications
} from "@material-ui/icons"

import {
    Paper,
    Typography,
    Tabs,
    Tab
} from '@material-ui/core';

import { connect } from 'react-redux';

function DashboardHeader(props){
    return (
        <Paper className="dashapp-header">
        <Typography variant="h6">{props.title}</Typography>
        <div className="dashapp-header__tabs">
            <Tabs value={props.tabs.map((x) => x.toLowerCase()).indexOf(props.selectedTab.toLowerCase())} onChange={(e, newVal) => {
                props.onTabSelect(props.tabs[newVal])
            }}>
            {(props.tabs || []).map((x) => (
                <Tab label={x} />
            ))}
            </Tabs>

        </div>
        <div className="actions-col">
          <Notifications />
          <div className="user-info">
            <Typography variant="subtitle1">{props.user.name}</Typography>
            <span style={{color: props.status =="connected" ? 'green': 'red'}}>{props.status == "connected" ? "Online" : "Offline"}</span>
          </div>
        </div>
        </Paper>
    )
}

export default connect((state) => ({
    status: state.auth.status,
    user: jwt_decode(state.auth.token)
}), (dispatch) => ({

}))(DashboardHeader)
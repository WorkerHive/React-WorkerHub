import React from 'react';

import {
    Drawer,
    List,
    ListItem,
    Divider,
} from '@material-ui/core';

import {
  Contacts,
    Notifications,
    AccountTree,
    Dashboard,
    CalendarToday,
    SupervisorAccount,
    BusinessCenter,
    Description,
    Settings,
    LocalLibrary
  } from '@material-ui/icons';

import { withRouter } from 'react-router-dom'

import WorkhubLogo from '../../assets/teal.png';

function Sidebar(props){
    const menu = [
        {
          icon: <Dashboard />,
          label: "Dashboard",
          path: ""
        },
        {
          icon: <CalendarToday />,
          label: "Calendar",
          path: "/calendar"
        },
        {
          icon: <AccountTree />,
          label: "Projects",
          path: "/projects"
        },
        {
          icon: <SupervisorAccount />,
          label: "Team",
          path: "/team"
        },
        {
          icon: <BusinessCenter /> ,
          label: "Equipment",
          path: "/equipment"
        },
        {
          icon: <Description />,
          label: "Files",
          path: "/files"
        },
        {
          icon: <LocalLibrary />,
          label: "Documentation",
          path: '/kb'
        },
        {
          icon: <Contacts />,
          label: "Contacts",
          path: "/contacts"
        }
      ]

    return (
        <Drawer variant="permanent" style={{width: 200}}>
        <List style={{flex: 1, width: 200}}> 
        <ListItem style={{color: 'teal', padding: 12, fontSize: 20}}>
           <img src={WorkhubLogo} style={{height: 33, marginRight: 8}} /> WorkHub
        </ListItem>
        <Divider />
        {menu.map((x, ix) => (
            <ListItem 
            className={menu.map((x) => x.path).indexOf(window.location.pathname.split(props.match.url)[1]) == ix ? 'selected menu-item': 'menu-item'}
            onClick={() => props.history.push(`${props.match.url}${x.path}`)}
            button >{x.icon} {x.label}</ListItem>
        ))}
        </List>
        <Divider />
        <ListItem button onClick={() => props.history.push(`${props.match.url}/settings`)}>
            <Settings style={{marginRight: 12}} />
            Settings
        </ListItem>
        </Drawer>
    )
}

export default withRouter(Sidebar)
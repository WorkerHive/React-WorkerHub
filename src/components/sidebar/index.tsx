import React from 'react';

import {
    Typography,
    List,
    ListItem,
    IconButton,
    Divider,
    Paper
} from '@material-ui/core';

import {
  Contacts,
    AccountTree,
    Dashboard,
    CalendarToday,
    SupervisorAccount,
    BusinessCenter,
    Description,
    EmojiNature,
    Settings,
    LocalLibrary,
    ChevronLeft,
    ChevronRight
  } from '@material-ui/icons';

import { withRouter } from 'react-router-dom'

import './index.css';

export interface SidebarProps {
    history: any;
    match: any;
}

export function Sidebar(props : SidebarProps){
  const [ minimized, setMinimized ] = React.useState(true);
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
        },
        {
          icon: <EmojiNature />,
          label: "Workflows",
          path: '/workflows'
        }
      ]

    return (
      <Paper className="sidebar" style={{width: minimized ? 64 : 200}} >
        <List style={{flex: 1, maxWidth: minimized ? 64 : 200, transition: 'max-width 200ms ease-in'}}> 
        <ListItem style={{position: 'relative', color: 'teal', padding: 12, fontSize: 20, justifyContent: 'flex-start'}}>
           <img src={'/assets/teal.png'} alt="Workhub" style={{height: 33, marginRight: minimized ? 0 : 8, marginLeft: minimized ? 0: 0}} /> 

           {!minimized && <Typography>Workhub</Typography>}

           <IconButton size="small" style={{backgroundColor: 'green', zIndex: 9, position: 'absolute', right: -12, bottom: -12}} onClick={() => setMinimized(!minimized)}>
              {minimized ? <ChevronRight style={{color: 'rgb(222,222,222)'}}/> : <ChevronLeft style={{color: 'rgb(222,222,222)'}} />}  
           </IconButton>
          
        </ListItem>
        <Divider />
        {menu.map((x, ix) => (
            <ListItem 
            className={menu.map((x) => x.path).indexOf(window.location.pathname.split(props.match.url)[1]) == ix ? 'selected menu-item': 'menu-item'}
            onClick={() => props.history.push(`${props.match.url}${x.path}`)}
            button >
              {x.icon} 
              {!minimized && x.label}
            </ListItem>
        ))}
        </List>
        <Divider />
        <ListItem style={{justifyContent: minimized ? 'center' : "initial"}} button onClick={() => props.history.push(`${props.match.url}/settings`)}>
            <Settings style={{marginRight: minimized ? 0 : 12}} />
            {!minimized && <Typography>Settings</Typography>}
        </ListItem>
        </Paper>
    )
}

export default withRouter(Sidebar)
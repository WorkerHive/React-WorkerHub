import React from 'react';

import {
  Drawer,
  List,
  Divider,
  ListItem,
  Paper,
  Typography,
  Tabs,
  Tab
} from '@material-ui/core';

import {
  Notifications,
  AccountTree,
  Dashboard,
  CalendarToday,
  SupervisorAccount,
  BusinessCenter,
  Description,
  Settings
} from '@material-ui/icons';

import { connect } from 'react-redux';

import Projects from '../../views/Projects';
import ProjectView from '../../views/ProjectView';

import Files from '../../views/Files';
import Calendar from '../../views/Calendar';
import SettingsView from '../../views/Settings';
import Teams from '../../views/Team';
import Equipment from '../../views/Equipment';
import AdminView from '../../views/Admin';
import qs from 'qs';
import jwt_decode from 'jwt-decode';
import { Switch, Route } from 'react-router-dom';

import IPFS from 'ipfs';

import { getTypes, getPermissions } from '../../actions/adminActions'

import './index.css';

function DashboardController(props){
  let query_string = qs.parse(props.location.search, {ignoreQueryPrefix: true})

  const currentPath = window.location.pathname.replace(/\/dashboard/g, '')

  const [ ipfsNode, setIPFS ] = React.useState(null)

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
  ]

  React.useEffect(async () => {
    props.getTypes()
    props.getPermissions()

    const node = await IPFS.create()
    setIPFS(node)
    console.log(await node.id())
  }, [])

  const renderTitle = () => {
    switch(currentPath){
      case '':
      case '/':
        return "Dashboard";
      case '/calendar':
        return "Calendar"
      case '/projects':
        return "Projects"
      case '/team':
        return "Team";
      case '/equipment':
        return "Equipment"
      case '/files':
        return "Files";
    }
  }

  const renderActionBlock = () => {
    console.log(currentPath)
    switch(currentPath){
      case '/projects':
        let project_set = [...new Set(props.projects.map((x) => x.status))]
        console.log(project_set)
        return (
        <Tabs value={project_set.indexOf(query_string.status)}>
          {project_set.map((x) => (
            <Tab label={x} onClick={() => {
              query_string.status = x;
            props.history.push(`${props.location.pathname}?${qs.stringify(query_string)}`)
          }}/>
          ))}
        </Tabs>
        )
      default:
        return null;
    }
  }

  return (
    <div className="dashapp">
      <Drawer variant="permanent" style={{width: 200}}>
        <List style={{flex: 1, width: 200}}> 
          <ListItem style={{fontWeight: 'bold', padding: 12, fontSize: 20}}>
            WorkHub
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
      <div className="dashapp-body">

        <Switch>
          <Route path={`${props.match.url}/calendar`} component={Calendar} />
          <Route path={`${props.match.url}/projects`} component={Projects} exact />
          <Route path={`${props.match.url}/projects/:id`} component={ProjectView} />
          <Route path={`${props.match.url}/files`} render={(props) => {
            return <Files {...props} ipfs={ipfsNode} />
          }} />
          <Route path={`${props.match.url}/team`} component={Teams} />
          <Route path={`${props.match.url}/equipment`} component={Equipment} />
          <Route path={`${props.match.url}/settings`} component={SettingsView} />
          <Route path={`${props.match.url}/admin`} component={AdminView} />
        </Switch>
      </div>
    </div>
  );
}

export default connect((state) => ({
  projects: state.projects.list,
  user: jwt_decode(state.auth.token)
}), (dispatch) => ({
  getTypes: () => dispatch(getTypes()),
  getPermissions: () => dispatch(getPermissions())
}))(DashboardController)

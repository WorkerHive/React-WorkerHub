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

import KnowledgeBase from '../../views/KnowledgeBase';
import Projects from '../../views/Projects';
import ProjectView from '../../views/ProjectView';
import DashboardView from '../../views/Dashboard';
import Contacts from '../../views/Contacts';
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

import { setStatus, getNodeConf } from '../../actions/authActions';
import { getTypes, getPermissions } from '../../actions/adminActions'
import Sidebar from '../../components/sidebar';
import YActions, {YProvider} from '../../graph/yjs';
import { IPFSProvider } from '../../graph/ipfs'

import './index.css';


function DashboardController(props){

  let query_string = qs.parse(props.location.search, {ignoreQueryPrefix: true})

  const currentPath = window.location.pathname.replace(/\/dashboard/g, '')

  console.log(props.swarmKey)

  React.useEffect(async () => {
    props.getTypes()
    //props.getPermissions()

    //console.log(await node.id())

    
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
    <IPFSProvider swarmKey={props.swarmKey}>
    <YProvider>
    <div className="dashapp">
      <Sidebar match={props.match} />
      <div className="dashapp-body">

        <Switch>
          <Route path={`${props.match.url}`} exact component={DashboardView} />
          <Route path={`${props.match.url}/calendar`} render={(props) => (
            <Calendar {...props} />
          )} />
          <Route path={`${props.match.url}/projects`} component={Projects} exact />
          <Route path={`${props.match.url}/projects/:id`} render={(props) => (
            <ProjectView {...props} />
          )} />
          <Route path={`${props.match.url}/files`} render={(props) => {
            return <Files {...props}  />
          }} />
          <Route path={`${props.match.url}/contacts`} component={Contacts} />
          <Route path={`${props.match.url}/kb`} component={KnowledgeBase} />
          <Route path={`${props.match.url}/team`} component={Teams} />
          <Route path={`${props.match.url}/equipment`} component={Equipment} />
          <Route path={`${props.match.url}/settings`} component={SettingsView} />
          <Route path={`${props.match.url}/admin`} component={AdminView} />
        </Switch>
      </div>
    </div>
    </YProvider>
    </IPFSProvider>
  );
}

export default connect((state) => ({
  projects: state.projects.list,
  user: jwt_decode(state.auth.token),
  swarmKey: state.auth.swarmKey
}), (dispatch) => ({
  getTypes: () => dispatch(getTypes()),
  getPermissions: () => dispatch(getPermissions()),
  setStatus: (status) => dispatch(setStatus(status))
}))(DashboardController)

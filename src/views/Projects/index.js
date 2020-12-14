import React from 'react';

import {
  ViewHeadline,
  ViewModule,
  Search,
  Add
} from '@material-ui/icons';

import {
  List,
  ListItem,
  InputAdornment,
  ButtonGroup,
  Button,
  Paper,
  Divider,
  TextField,
  Fab
} from '@material-ui/core';

import DashboardHeader from '../../components/dashboard-header';

import { useMutation } from '@apollo/client'
import { connect } from 'react-redux';
import SearchTable from '../../components/search-table';
import PermissionForm from '../../components/permission-form';
import { UPDATE_PROJECT, addProject, getProjects } from '../../actions/projectActions';
import qs from 'qs';

import './index.css';

function Projects(props){
  const query_string = qs.parse(props.location.search, {ignoreQueryPrefix: true})
  const [ selected, setSelected ] = React.useState(null)
  const [ updateProject] = useMutation(UPDATE_PROJECT)

  React.useEffect(() => {
    props.getProjects() 
  }, [])

  return [
    <DashboardHeader 
    tabs={["ALL", ...new Set(props.projects.filter((a) => a.status != null && a.status != undefined).map((x) => x.status.trim().toUpperCase()))] || []}
    onTabSelect={(tab) => {
      if(tab == "ALL"){
        delete query_string.status;
        props.history.push(`${window.location.pathname}?${qs.stringify(query_string)}`)
      }else{
        query_string.status = tab;
        props.history.push(`${window.location.pathname}?${qs.stringify(query_string)}`)
      }
        //setSelectedTab(tab)
        //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={query_string.status && query_string.status.toUpperCase() || 'ALL'}
    title={"Projects"} />,
    <PermissionForm
      onSave={(data) => {
        if(data.id){
          let d = Object.assign({}, data);
          delete d.id
          updateProject({variables: {projectId: data.id, project: d}})
        }else{
          props.addProject(data)
        }
      }} 
      onClose={() => setSelected(null)}
      selected={selected} 
      type={props.type} 
      permissions={props.permissions}>
      <SearchTable
        data={props.projects.filter((a) => {
          if(query_string.status && a.status == query_string.status){
            return true;
          }else if(!query_string.status){
            return true;
          }
          return false;
        }).filter((a) => a.name)}
        renderItem={(item) => (
          <ListItem onClick={() => {
            //setSelected(item)
             props.history.push(`${props.match.url}/${item.id}/plan`)
          }}button>{item.name}</ListItem>
        )} />

    </PermissionForm>

  ]
}

export default connect((state) => ({
  projects: state.projects.list,
  type: state.dashboard.types.filter((a) => a.name == "Projects"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Projects")
}), (dispatch) => ({
  getProjects: () => dispatch(getProjects()),
  addProject: (project) => dispatch(addProject(project))
}))(Projects)

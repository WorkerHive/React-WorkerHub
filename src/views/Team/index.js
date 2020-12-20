import React from 'react';

import {
  Paper,
  Typography,
  List,
  ListItem
} from '@material-ui/core';

import {
  SupervisedUserCircle,
  SupervisorAccount,
  Schedule,
  Edit,
  Delete,
  Share
} from '@material-ui/icons';

import DashboardHeader from '../../components/dashboard-header';
import SearchTable from '../../components/search-table';
import { useMutation } from "@apollo/client";
import { removeTeamMember, addTeamMember, updateTeamMember, getTeam } from '../../actions/teamActions';
import PermissionForm from '../../components/permission-form';
import MoreMenu from '../../components/more-menu';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'
import './index.css';

function Teams(props){
  const [ selected, setSelected ] = React.useState(null)

  React.useEffect(() => {
    props.getTeam()
  }, [])

  console.log(props.user)

  return [
    <DashboardHeader 
    tabs={[]}
    onTabSelect={(tab) => {
       // setSelectedTab(tab)
      //  props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={''}
    title={"Team"} />,
    <PermissionForm 
      onSave={(data) => {
        if(data.id){
          let d = Object.assign({}, data);
          delete d.id;
          props.updateTeamMember(data.id, d)
      
        }else{
          props.addTeamMember(data)
        }
      }}
      onClose={() => setSelected(null)} 
      selected={selected}
      type={props.type} 
      permissions={props.permissions}>
      <SearchTable 
        data={props.team}
        renderItem={(item) => (
          <div className="team-item">
          <ListItem button >
            {item.status == "pending" ? <Schedule /> : item.admin ? <SupervisorAccount /> : <SupervisedUserCircle />}
            <Typography style={{marginLeft: 12}}>
              {item.name}
            </Typography>
          </ListItem>
          <MoreMenu 
            menu={[
            ].concat(item.status == "pending" ? [
              {
                icon: <Share />,
                label: "Share Signup",
                action: () => {}
              }
            ] : []).concat(props.user.admin ? [{
              label: "Edit",
              icon: <Edit />,
              action: () => setSelected(item)
            },
            {
              label: "Delete",
              color: 'red',
              icon: <Delete />,
              action: () => props.removeTeamMember(item.id)
            }] : [])} />
          </div>
        )} />
    </PermissionForm>
  ]
}

export default connect((state) => ({
  user: jwt_decode(state.auth.token),
  team: state.team.list,
  type: state.dashboard.types.filter((a) => a.name == "Team Members"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Team Members")
}), (dispatch) => ({
  getTeam: () => dispatch(getTeam()),
  addTeamMember: (member) => dispatch(addTeamMember(member)),
  removeTeamMember: (id) => dispatch(removeTeamMember(id)),
  updateTeamMember: (id, member) => dispatch(updateTeamMember(id, member))
}))(Teams)

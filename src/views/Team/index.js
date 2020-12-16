import React from 'react';

import {
  Paper,
  List,
  ListItem
} from '@material-ui/core';
import DashboardHeader from '../../components/dashboard-header';
import SearchTable from '../../components/search-table';
import { useMutation } from "@apollo/client";
import { removeTeamMember, addTeamMember, UPDATE_TEAM_MEMBER, getTeam } from '../../actions/teamActions';
import PermissionForm from '../../components/permission-form';
import MoreMenu from '../../components/more-menu';
import { connect } from 'react-redux';
import './index.css';

function Teams(props){
  const [ selected, setSelected ] = React.useState(null)

  const [ updateTeamMember ] = useMutation(UPDATE_TEAM_MEMBER)

  React.useEffect(() => {
    props.getTeam()
  }, [])

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
          let d = data;
          delete d.id;
          updateTeamMember({variables: {
            memberId: data.id,
            member: d
          }})
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
          <ListItem button >{item.name}</ListItem>
          <MoreMenu onEdit={() => {
              setSelected(item)
          }} onDelete={() => {
            props.removeTeamMember(item.id)
          }}/>
          </div>
        )} />
    </PermissionForm>
  ]
}

export default connect((state) => ({
  team: state.team.list,
  type: state.dashboard.types.filter((a) => a.name == "Team Members"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Team Members")
}), (dispatch) => ({
  getTeam: () => dispatch(getTeam()),
  addTeamMember: (member) => dispatch(addTeamMember(member)),
  removeTeamMember: (id) => dispatch(removeTeamMember(id))
}))(Teams)

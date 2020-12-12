import React from 'react';

import {
  Paper,
  List,
  ListItem
} from '@material-ui/core';
import DashboardHeader from '../../components/dashboard-header';
import SearchTable from '../../components/search-table';
import { useMutation } from "@apollo/client";
import { ADD_TEAM_MEMBER, UPDATE_TEAM_MEMBER, getTeam } from '../../actions/teamActions';
import PermissionForm from '../../components/permission-form';
import { connect } from 'react-redux';

function Teams(props){
  const [team, setTeam ] = React.useState([])
  const [ selected, setSelected ] = React.useState(null)

  const [ addTeamMember, ] = useMutation(ADD_TEAM_MEMBER);
  const [ updateTeamMember ] = useMutation(UPDATE_TEAM_MEMBER)

  React.useEffect(() => {
    getTeam().then((result) => setTeam(result.data.team))
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
          addTeamMember({variables: {member: data}})
        }
      }}
      onClose={() => setSelected(null)} 
      selected={selected}
      type={props.type} 
      permissions={props.permissions}>
      <SearchTable 
        data={team}
        renderItem={(item) => (
          <ListItem button onClick={() => setSelected(item)}>{item.name}</ListItem>
        )} />
    </PermissionForm>
  ]
}

export default connect((state) => ({
  type: state.dashboard.types.filter((a) => a.name == "Team Members"),
  permissions: state.dashboard.permissions.filter((a) => a.type == "Team Members")
}))(Teams)

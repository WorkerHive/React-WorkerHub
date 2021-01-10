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


import { useMutation } from "@apollo/client";
import { getSignupLink, removeTeamMember, addTeamMember, updateTeamMember, getTeam } from '../../actions/teamActions';
import { PermissionForm, SearchTable, MoreMenu, Header } from '@workerhive/react-ui'
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode'
import './index.css';

export interface TeamsProps{
  getTeam: Function;
  removeTeamMember: Function;
  addTeamMember: Function;
  updateTeamMember: Function;
  type: any;
  permissions: any;
  team: any;
  user: any;
}

const Teams : React.FC<TeamsProps> = (props) => {
  const [selected, setSelected] = React.useState(null)

  React.useEffect(() => {
    props.getTeam()
  }, [])

  console.log(props.user)

  return (
    <>
    <Header
      tabs={[]}
      onTabSelect={(tab : any) => {
        // setSelectedTab(tab)
        //  props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
      }}
      selectedTab={''}
      title={"Team"} />
    <PermissionForm
      onSave={(data : any) => {
        if (data.id) {
          let d = Object.assign({}, data);
          delete d.id;
          props.updateTeamMember(data.id, d)

        } else {
          props.addTeamMember(data)
        }
      }}
      onClose={() => setSelected(null)}
      selected={selected}
      type={props.type}
      permissions={props.permissions}>
      <SearchTable
        filter={(item : any, search : any) => item.name.indexOf(search) > -1}
        data={props.team}
        renderItem={(item : any) => (
          <div className="team-item">
            <ListItem button >
              {item.status === "pending" ? <Schedule /> : item.admin ? <SupervisorAccount /> : <SupervisedUserCircle />}
              <Typography style={{ marginLeft: 12 }}>
                {item.name}
              </Typography>
            </ListItem>
            <MoreMenu
              menu={(item.status === "pending" ? [
                {
                  icon: <Share />,
                  label: "Share Signup",
                  action: () => {
                    getSignupLink(item.id).then((link : any) => {
                      console.log("SIGNUP TOKEN", link)
                    })

                  }
                }
              ] : []).concat(props.user.admin && [{
                label: "Edit",
                icon: <Edit />,
                action: () => setSelected(item)
              },
              {
                label: "Delete",
                color: 'red',
                icon: <Delete />,
                action: () => props.removeTeamMember(item.id)
              }])} />
          </div>
        )} />
    </PermissionForm>
    </>
  )
}

export default connect((state : any) => ({
  user: jwt_decode(state.auth.token),
  team: state.team.list,
  type: state.dashboard.types.filter((a : any) => a.name === "TeamMember"),
  permissions: state.dashboard.permissions.filter((a: any) => a.type === "TeamMember")
}), (dispatch : any) => ({
  getTeam: () => dispatch(getTeam()),
  addTeamMember: (member : any) => dispatch(addTeamMember(member)),
  removeTeamMember: (id : any) => dispatch(removeTeamMember(id)),
  updateTeamMember: (id : any, member : any) => dispatch(updateTeamMember(id, member))
}))(Teams)

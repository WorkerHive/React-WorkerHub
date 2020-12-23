import { gql } from '@apollo/client';
import * as types from './types';
import GClient, {withGraph} from '../graph';

const graph = withGraph()

export const addTeamMember = (member) => {
  return (dispatch) => {
    graph.getClient().mutate({
      mutation: gql`
  mutation AddTeamMember($member: TeamMemberInput){
    addTeamMember(member: $member){
      id
      name
      username
      email
      status
      phoneNumber
      admin
    }
  }
`,
      variables: {
        member: member
      }
    }).then((r) => r.data.addTeamMember).then((r) => {
      dispatch({type: types.ADD_TEAM_MEMBER, newMember: r})
    })
  }
}

export const updateTeamMember = (memberId, member) => {
  return (dispatch) => {
    graph.getClient().mutate({
       mutation: gql`
  mutation UpdateTeam($memberId: String, $member: TeamMemberInput){
    updateTeamMember(memberId: $memberId, member: $member){
      name
      email
      phoneNumber
      admin
    }
  }
`,
    variables: {
      memberId: memberId,
      member: member
    }
  }).then((r) => r.data.updateTeamMember).then((r) => {
    dispatch({type: types.UPDATE_TEAM_MEMBER, member: member, id: memberId})
  })
  }
}

export const removeTeamMember = (id) => {
  return (dispatch, getState) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveMember($memberId: ID){
          removeTeamMember(memberId: $memberId)
        }
      `,
      variables: {
        memberId: id
      }
    }).then((r) => r.data.removeTeamMember).then((r) => {
      dispatch({type: types.REMOVE_TEAM_MEMBER, id: id})
    })
  }
}

export const getTeam = () => {
  return (dispatch) => {
    return graph.getClient().query({
      query: gql`
        query GetTeam {
          team {
            id
            status
            name
            username
            password
            phoneNumber
            email
            admin
          }
        }
      `
    }).then((r) => r.data.team).then((r) => {
      dispatch({type: types.SET_TEAM, team: r})
    })
  }
}

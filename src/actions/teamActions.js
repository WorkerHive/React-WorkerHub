import { gql } from '@apollo/client';
import * as types from './types';
import GClient from '../graph';

const client = GClient()

export const addTeamMember = (member) => {
  return (dispatch) => {
    client.mutate({
      mutation: gql`
  mutation AddTeamMember($member: TeamMemberInput){
    addTeamMember(member: $member){
      id
      name
      email
      phoneNumber
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

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeam($memberId: ID, $member: TeamMemberInput){
    updateTeamMember(memberId: $memberId, member: $member){
      name
      email
      phoneNumber
    }
  }
`

export const removeTeamMember = (id) => {
  return (dispatch, getState) => {
    return client.mutate({
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
    return client.query({
      query: gql`
        query GetTeam {
          team {
            id
            name
            username
            password
            phoneNumber
            email
          }
        }
      `
    }).then((r) => r.data.team).then((r) => {
      dispatch({type: types.SET_TEAM, team: r})
    })
  }
}

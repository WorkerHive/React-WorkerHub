import { gql } from '@apollo/client';
import * as types from './types';
import {withGraph} from '../graph';

const graph = withGraph()

export const addTeamMember = (member : any) => {
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.addTeamMember).then((r : any) => {
      dispatch({type: types.ADD_TEAM_MEMBER, newMember: r})
    })
  }
}

export const updateTeamMember = (memberId : any, member : any) => {
  return (dispatch : any) => {
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
  }).then((r : any) => r.data.updateTeamMember).then((r : any) => {
    dispatch({type: types.UPDATE_TEAM_MEMBER, member: member, id: memberId})
  })
  }
}

export const removeTeamMember = (id : any) => {
  return (dispatch: any, getState : any) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveMember($memberId: ID){
          removeTeamMember(memberId: $memberId)
        }
      `,
      variables: {
        memberId: id
      }
    }).then((r : any) => r.data.removeTeamMember).then((r : any) => {
      dispatch({type: types.REMOVE_TEAM_MEMBER, id: id})
    })
  }
}

export const getSignupLink = (id : any) => {
  return graph.getClient().query({
    query: gql`
      query GetSignupLink($user: ID){
        getSignupLink(user: $user){
          error
          token
        }
      }
    `,
    variables: {
      user: id
    }
  }).then((r : any) => r.data.getSignupLink);
}

export const getTeam = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetTeam {
          teamMembers {
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
    }).then((r : any) => r.data.teamMembers).then((r : any) => {
      dispatch({type: types.SET_TEAM, team: r})
    })
  }
}

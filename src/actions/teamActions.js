import { gql } from '@apollo/client';

import GClient from '../graph';

const client = GClient()

export const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember($member: TeamMemberInput){
    addTeamMember(member: $member){
      id
      name
      email
      phoneNumber
    }
  }
`

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeam($memberId: ID, $member: TeamMemberInput){
    updateTeamMember(memberId: $memberId, member: $member){
      name
      email
      phoneNumber
    }
  }
`

export const getTeam = () => {
  return client.query({
    query: gql`
      query GetTeam {
        team {
          id
          name
          phoneNumber
          email
        }
      }
    `
  })
}

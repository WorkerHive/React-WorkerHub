import * as types from './types';
import { gql } from '@apollo/client';
import { cloneDeep } from 'lodash';
import {withGraph} from '../graph';

const graph = withGraph()

export const addProject = (project : any) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
      mutation AddProject($project: ProjectInput){
        addProject(project: $project){
          id
          name
          description
          status
        }
      }
    `,
    variables: {
      project: project
    }
    }).then((r) => r.data.addProject).then((r) => {
      dispatch({type: types.ADD_PROJECT, newProject: r})
    })
  }
}

export const updateProject = (projectId : string, project : any) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
  mutation UpdateProject($projectId: ID, $project: ProjectInput){
    updateProject(projectId: $projectId, project: $project){
      id
      name
      description
      status
    }
  }
`, 
variables: {
  projectId: projectId,
  project: project
}}).then((r) => r.data.updateProject).then((r) => {
  dispatch({type: types.UPDATE_PROJECT, project: project, id: projectId})
})
} 
  }

  export const removeProject = (projectId : any) => {
    return (dispatch : any) => {
      return graph.getClient().mutate({
        mutation: gql`
          mutation RemoveProject($projectId: ID){
            removeProject(projectId: $projectId)
          }
        `,
          variables: {
            projectId: projectId
          }
      }).then((r) => r.data.removeProject).then((r) => {
        if(r) dispatch({type: types.REMOVE_PROJECT, id: projectId})
      })
    }

  }

export const getProjects = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetProjects {
          projects{
            id
            name
            description
            status
            files{
              filename
              cid
            }
          }
        }
      `
    }).then((r) => {
      dispatch({type: types.SET_PROJECTS, projects: r.data.projects.map((x : any) => {
        let y = cloneDeep(x)
        delete y.__typename;
        return y;
      })})      
    })
  }
}

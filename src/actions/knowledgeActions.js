import { gql } from '@apollo/client';
import * as types from './types';
import GClient, {withGraph} from '../graph';

const graph = withGraph()

export const addKnowledge = (knowledge) => {
  return (dispatch) => {
    graph.getClient().mutate({
      mutation: gql`
  mutation AddKnowledge($knowledge: KnowledgeInput){
    addKnowledge(knowledge: $knowledge){
      id
      title
      description
    }
  }
`,
    variables: {
      knowledge: knowledge
    }
  }).then((r) => r.data.addKnowledge).then((r) => {
    dispatch({type: types.ADD_KNOWLEDGE, newItem: r})
  })
}
}

export const updateKnowledge = (id, knowledge) => {
  let kb = {
    title: knowledge.title,
    description: knowledge.description
  }
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation:  gql`
      mutation UpdateKnowledge($id: ID, $knowledge: KnowledgeInput){
        updateKnowledge(id: $id, knowledge: $knowledge){
          title
          description
        }
      }
    `,
    variables: {
      id: id,
      knowledge: kb
    }
    }).then((r) => r.data.updateKnowledge).then((r) => {
      dispatch({type: types.UPDATE_KNOWLEDGE, knowledge, id})
    })
  }
}

export const removeKnowledge = (id) => {
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveEquipment($id: String){
          removeEquipment(equipmentId: $id)
        }
      `,
      variables: {
        id: id
      }
    }).then((r) => r.data.removeEquipment).then((r) => {
      dispatch({type: types.REMOVE_EQUIPMENT, id: id})
    })
  }
}


export const getKnowledge = () => {
  return (dispatch) => {
    return graph.getClient().query({
      query: gql`
        query GetKnowledge {
          knowledges {
            id
            title
          }
        }
      `
    }).then((r) => r.data.knowledges).then((r) => {
      dispatch({type: types.SET_KNOWLEDGE, knowledge: r})
    })
  }
 
}

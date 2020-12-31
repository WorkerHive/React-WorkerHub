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

export const updateKnowledge = (id, equipment) => {
  console.log(id, equipment)
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation:  gql`
      mutation UpdateEquipment($equipmentId: String, $equipment: EquipmentInput){
        updateEquipment(equipmentId: $equipmentId, equipment: $equipment){
          name
          type
          description
        }
      }
    `,
    variables: {
      equipmentId: id,
      equipment
    }
    }).then((r) => r.data.updateEquipment).then((r) => {
      dispatch({type: types.UPDATE_EQUIPMENT, equipment, id})
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

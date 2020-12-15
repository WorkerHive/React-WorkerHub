import { gql } from '@apollo/client';
import * as types from './types';
import GClient from '../graph';

const client = GClient()

export const addEquipment = (equipment) => {
  return (dispatch) => {
    client.mutate({
      mutation: gql`
  mutation AddEquipment($equipment: EquipmentInput){
    addEquipment(equipment: $equipment){
      id
      name
      type
      description
    }
  }
`,
    variables: {
      equipment: equipment
    }
  }).then((r) => r.data.addEquipment).then((r) => {
    dispatch({type: types.ADD_EQUIPMENT, newItem: r})
  })
}
}

export const updateEquipment = (id, equipment) => {
  console.log(id, equipment)
  return (dispatch) => {
    return client.mutate({
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

export const removeEquipment = (id) => {
  return (dispatch) => {
    return client.mutate({
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


export const getEquipment = () => {
  return (dispatch) => {
    return client.query({
      query: gql`
        query GetEquipment {
          equipment {
            id
            name
            type
            description
          }
        }
      `
    }).then((r) => r.data.equipment).then((r) => {
      dispatch({type: types.SET_EQUIPMENT, equipment: r})
    })
  }
 
}

import { gql } from '@apollo/client';
import * as types from './types';
import {withGraph} from '../graph';

const graph = withGraph()

export const addEquipment = (equipment : any) => {
  return (dispatch : any) => {
    graph.getClient().mutate({
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
  }).then((r : any) => r.data.addEquipment).then((r : any) => {
    dispatch({type: types.ADD_EQUIPMENT, newItem: r})
  })
}
}

export const updateEquipment = (id : string, equipment: any) => {
  console.log(id, equipment)
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.updateEquipment).then((r : any) => {
      dispatch({type: types.UPDATE_EQUIPMENT, equipment, id})
    })
  }
}

export const removeEquipment = (id : string) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation RemoveEquipment($id: String){
          removeEquipment(equipmentId: $id)
        }
      `,
      variables: {
        id: id
      }
    }).then((r : any) => r.data.removeEquipment).then((r : any) => {
      dispatch({type: types.REMOVE_EQUIPMENT, id: id})
    })
  }
}


export const getEquipment = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetEquipment {
          equipments {
            id
            name
            type
            description
          }
        }
      `
    }).then((r : any) => r.data.equipments).then((r : any) => {
      dispatch({type: types.SET_EQUIPMENT, equipment: r})
    })
  }
 
}

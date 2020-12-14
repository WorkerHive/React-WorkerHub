import { gql } from '@apollo/client';
import * as types from './types';
import GClient from '../graph';

const client = GClient()

export const ADD_EQUIPMENT = gql`
  mutation AddEquipment($equipment: EquipmentInput){
    addEquipment(equipment: $equipment){
      id
      name
      type
      description
    }
  }
`

export const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment($equipmentId: ID, $equipment: EquipmentInput){
    updateEquipment(equipmentId: $equipmentId, equipment: $equipment){
      name
      type
      description
    }
  }
`

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

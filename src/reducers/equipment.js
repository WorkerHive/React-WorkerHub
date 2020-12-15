import * as types from '../actions/types';

const INIT = {
    list: []
}

let updated;
export default function equipmentReducer(state = INIT, action={}){
    switch(action.type){
        case types.SET_EQUIPMENT:
            return {
                ...state,
                list: action.equipment
            }
        case types.ADD_EQUIPMENT:
            return {
                ...state,
                list: state.list.concat([action.newItem])
            }
        case types.UPDATE_EQUIPMENT:
            updated = state.list.slice()
            let ix = updated.map((x) => x.id).indexOf(action.id)
            updated[ix] = {
                ...updated[ix],
                ...action.equipment
            }
            return {
                ...state,
                list: updated
            }
        case types.REMOVE_EQUIPMENT:
            updated = state.list.slice()
            let eIx = updated.map((x) => x.id).indexOf(action.id)
            updated.splice(eIx, 1)
            return {
                ...state,
                list: updated
            }
        default:
            return state;
    }
}
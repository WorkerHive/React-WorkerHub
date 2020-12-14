import * as types from '../actions/types';

const INIT = {
    list: []
}

export default function equipmentReducer(state = INIT, action={}){
    switch(action.type){
        case types.SET_EQUIPMENT:
            return {
                ...state,
                list: action.equipment
            }
        default:
            return state;
    }
}
import * as types from '../actions/types';

const INIT = {
    permissions: [],
    types: []
}

export default function dashboardReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_DASHBOARD_PERMS:
            return {
                ...state,
                permissions: action.perms
            }
        case types.SET_DASHBOARD_TYPES:
            return {
                ...state,
                types: action.types
            }
        default:
            return state;
    }
}
import * as types from '../actions/types';

const INIT = {
    token: null,
    status: 'disconnected'
}

export default function authReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_TOKEN:
            return {
                ...state,
                token: action.token
            }
        case types.SET_STATUS:
            return {
                ...state,
                status:  action.status
            }
        default:
            return state;
    }
}
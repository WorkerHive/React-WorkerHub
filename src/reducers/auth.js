import * as types from '../actions/types';

const INIT = {
    token: null
}

export default function authReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_TOKEN:
            return {
                token: action.token
            }
        default:
            return state;
    }
}
import * as types from '../actions/types';

const INIT = {
    kb: []
}

export default function kbReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_KNOWLEDGE:
            return {
                ...state,
                kb: action.knowledge
            }
        default:
            return state;
    }
}
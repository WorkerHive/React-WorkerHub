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
        case types.ADD_KNOWLEDGE:
            return {
                ...state,
                kb: state.kb.concat([action.newItem])
            }
        case types.UPDATE_KNOWLEDGE:
            let kb = state.kb.slice();
            let ix = kb.map((x) => x.id).indexOf(action.id);

            console.log(kb, ix)
            kb[ix] = {
                ...kb[ix],
                ...action.knowledge
            }

            console.log(kb)
            return {
                ...state,
                kb: kb
            }
        default:
            return state;
    }
}
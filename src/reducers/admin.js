import * as types from '../actions/types'

const INIT = {
    stores: [],
    roles: [],
}

let s, ix;

export default function adminReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_STORES:
            return {
                ...state,
                stores: action.stores
            }
        case types.ADD_STORE:
            return {
                ...state,
                stores: state.stores.concat([action.newStore])
            }
        case types.UPDATE_STORE:
             s = state.stores.slice();
             ix = s.map((x) => x.id).indexOf(action.id);
            s[ix] = {
                ...s[ix],
                ...action.store
            }
            return {
                ...state,
                stores: s
            }
        case types.DELETE_STORE:
             s = state.stores.slice();
             ix = s.map((x) => x.id).indexOf(action.id);
            s.splice(ix, 1);
            return {
                ...state,
                stores: s
            }
        default:
            return state;
    }
}
import * as types from '../actions/types';

const INIT = {
    list: []
}

export default function contactReducer(state = INIT, action = {}){
    switch(action.type){
        case types.ADD_CONTACT:
            return {
                ...state,
                list: state.list.concat([action.newItem])
            }
        case types.UPDATE_CONTACT:
            let contacts = state.list.slice();
            let ix = contacts.map((x) => x.id).indexOf(action.id)

            contacts[ix] = {
                ...contacts[ix],
                ...action.contact
            }
            return {
                ...state,
                list: contacts
            }
        default:
            return state;
    }
}
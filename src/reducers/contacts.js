import * as types from '../actions/types';

const INIT = {
    list: [],
    organisations: []
}

export default function contactReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_CONTACT_ORGANIZATIONS:
            return {
                ...state,
                organisations: action.organisations
            }
        case types.SET_CONTACTS:
            return {
                ...state,
                list: action.contacts
            }
        case types.ADD_CONTACT:
            return {
                ...state,
                list: state.list.concat([action.newItem])
            }
        case types.ADD_CONTACT_ORGANIZATION:
            return {
                ...state,
                organisations: state.organisations.concat([action.newItem])
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
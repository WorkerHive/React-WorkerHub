import * as types from '../actions/types'

const INIT = {
    list: []
}

export default function teamReducer(state = INIT, action = {} ){
    switch(action.type){
        case types.SET_TEAM:
            return {
                ...state,
                list: action.team
            }
        case types.ADD_TEAM_MEMBER:
            return {
                ...state,
                list: state.list.concat([action.newMember])
            }
        case types.REMOVE_TEAM_MEMBER:
            let updated = state.list.slice()
            let tIx = updated.map((x) => x.id).indexOf(action.id)
            updated.splice(tIx, 1)
            return {
                ...state,
                list: updated
            }
        default:
            return state;
    }
}
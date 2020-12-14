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
        default:
            return state;
    }
}
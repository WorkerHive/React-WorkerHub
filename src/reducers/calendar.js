import * as types from '../actions/types';

const INIT = {
    bookings: []
}

export default function calendarReducer(state = INIT, action = {}){
    switch(action.type){
        case types.SET_BOOKINGS:
            return {
                ...state,
                bookings: action.bookings
            }
        case types.ADD_BOOKING:
            return {
                ...state,
                bookings: state.bookings.concat([action.booking])
            }
        default:
            return state;
    }
}
import * as types from '../actions/types';

const INIT = {
  list: []
}

export default function fileReducer(state = INIT, action = {}){
  switch(action.type){
    case types.SET_FILES:
      return {
        ...state,
        list: action.files
      }
    case types.ADD_FILE:
      return {
        ...state,
        list: state.list.concat([action.file])
      }
    default:
      return state;
  }
}

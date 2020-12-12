import * as types from '../actions/types';

const init = {
  list: []
}

export default function projectReducer(state = init, action={}){
  switch(action.type){
    case types.SET_PROJECTS:
      return {
        ...state,
        list: action.projects
      }
    default:
      return state;
  }
}

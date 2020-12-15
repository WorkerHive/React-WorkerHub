import * as types from '../actions/types';

const init = {
  list: []
}

let updated;

export default function projectReducer(state = init, action={}){
  switch(action.type){
    case types.SET_PROJECTS:
      return {
        ...state,
        list: action.projects
      }
    case types.ADD_PROJECT:
      return {
        ...state,
        list: state.list.concat([action.newProject])
      }
    case types.UPDATE_PROJECT:
      updated = state.list.slice()
      let ix = updated.map((x) => x.id).indexOf(action.id)
      updated[ix] = {
        ...updated[ix],
        ...action.project
      }
      return {
        ...state,
        list: updated
      }
    default:
      return state;
  }
}

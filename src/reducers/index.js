import { combineReducers } from 'redux';

import projects from './projects';
import dashboard from './dashboard';
import files from './files';
import auth from './auth';
import equipment from './equipment';
import team from './team';
import knowledge from './knowledge';
import calendar from './calendar';

export default combineReducers({
  projects,
  auth,
  files,
  calendar,
  dashboard,
  knowledge,
  equipment,
  team
})

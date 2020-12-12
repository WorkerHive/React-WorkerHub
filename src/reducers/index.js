import { combineReducers } from 'redux';

import projects from './projects';
import dashboard from './dashboard';
import files from './files';
import auth from './auth';

export default combineReducers({
  projects,
  auth,
  files,
  dashboard
})

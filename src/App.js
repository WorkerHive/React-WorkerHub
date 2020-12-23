import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import DashboardController from './controllers/DashboardController';
import Login from './views/Login';
import { PersistGate } from 'redux-persist/integration/react'

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers'

import GClient from './graph';
import configureStore from './configureStore';

import './App.css';

const { store, persistor } = configureStore();
const client = GClient();

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Provider store={store}>
      <ApolloProvider client={client}>
      <Router>
      <PersistGate loading={null} persistor={persistor}>

      <div className="App">
        <Route path="/" exact component={Login} />
        <Route path="/dashboard" render={(props) => {
          if(store.getState().auth.token){
            return <DashboardController {...props} />
          }else{
            return <Redirect to="/" />
          }
        }} />
        <Route render={() => <Redirect to="/"/>}/>
      </div>
      </PersistGate>
    </Router>
      </ApolloProvider>
    </Provider>
  </MuiPickersUtilsProvider>

  );
}

export default App;

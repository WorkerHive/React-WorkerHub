import React from 'react';
import isElectron from 'is-electron'

import { HashRouter, BrowserRouter, Route, Redirect } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import DashboardController from './controllers/DashboardController';
import Login from './views/Login';
import HubSetup from './views/Login/hub-setup'
import { PersistGate } from 'redux-persist/integration/react'

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers'

import GClient,{withGraph} from './graph';
import configureStore from './configureStore';
import './App.css';

let Router;
if(isElectron()){
  Router = HashRouter
}else{
  Router = BrowserRouter
}


const { store, persistor } = configureStore();
const graph = withGraph()


function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Provider store={store}>
      <ApolloProvider client={graph.getClient()}>
      <Router>
      <PersistGate loading={null} persistor={persistor}>

      <div className="App">
        <Route path="/" exact render={(props) => {
          if(isElectron() && !localStorage.getItem('workhub-api') || localStorage.getItem('workhub-api').length < 1){
            return <Redirect to="/setup" />
          }else{
            return <Login {...props} />
          }
        }} />
        {isElectron() && (
          <Route path="/setup" component={HubSetup} />
        )}
        <Route path="/dashboard" render={(props) => {
          if(store.getState().auth.token){
            return <DashboardController {...props} />
          }else{
            return <Redirect to="/" />
          }
        }} />
      </div>
      </PersistGate>
    </Router>
      </ApolloProvider>
    </Provider>
  </MuiPickersUtilsProvider>

  );
}

export default App;

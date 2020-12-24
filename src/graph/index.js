import React from 'react';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

import isElectron from 'is-electron';
let settings;
/*if(isElectron()){
  settings = require('electron-settings')
} */

let client;

export const withGraph = () => {
  

  const getURL = () => {
    let platform = 'web';

    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') platform = 'dev';
    if(isElectron()) platform = 'electron';

    if(window.location.hostname == "localhost" && localStorage.getItem('workhub-api')) platform = 'dev';

    switch(platform){
      case 'web':
        return '/graphql';
      case 'dev':
        return `https://${localStorage.getItem('workhub-api')}.workhub.services/graphql`
      case 'electron':
        return `https://${localStorage.getItem('workhub-api')}.workhub.services/graphql`
    }
  }

  let url = getURL()


  const startClient = () => {
    return new ApolloClient({
      link: createUploadLink({
        uri: getURL()
      }),
      cache: new InMemoryCache({
        addTypename: false
      })
    })
  }

  const setURL = (_url) => {
    console.log("Set url", _url)
    url = _url
    client = startClient()

    console.log(client, url)
  }

  if(url) client = startClient();

  return {
    getClient: () => client,
    setURL: setURL
  };
}

export default () => {

  const getURL = () => {
    let platform = 'web';

    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') platform = 'dev';
    if(isElectron()) platform = 'electron';

    switch(platform){
      case 'web':
        return '/graphql';
      case 'dev':
        return 'https://thetechcompany.workhub.services/graphql'
      case 'electron':
        return `https://${localStorage.getItem('workhub-api')}.workhub.services/graphql`
    }
  }

  try{
    return new ApolloClient({
      link: createUploadLink({
        uri: getURL()
      }),
      cache: new InMemoryCache({
        addTypename: false
      })
    })
  }catch(e){
    console.log(e)
  }
}

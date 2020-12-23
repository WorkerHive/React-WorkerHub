import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

import isElectron from 'is-electron';

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

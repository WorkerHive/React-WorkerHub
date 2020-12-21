import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

export default () => {
  try{
  return new ApolloClient({
    link: createUploadLink({
      uri: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        'https://thetechcompany.workhub.services/graphql' || 'http://localhost:4000/graphql' : 
        process.env.REACT_APP_GRAPH_URL || '/graphql',
    }),
    cache: new InMemoryCache({
      addTypename: false
    })
  })
  }catch(e){
    console.log(e)
  }
}

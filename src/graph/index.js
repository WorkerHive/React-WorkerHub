import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

export default () => {
  return new ApolloClient({
    link: createUploadLink({
      uri: process.env.REACT_APP_GRAPH_URL || 'http://api.workhub.services:8080',
    }),
    cache: new InMemoryCache()
  })
}

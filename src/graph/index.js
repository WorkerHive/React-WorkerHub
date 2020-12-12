import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

export default () => {
  return new ApolloClient({
    link: createUploadLink({
      uri: 'http://api.workhub.services:8080',
    }),
    cache: new InMemoryCache()
  })
}

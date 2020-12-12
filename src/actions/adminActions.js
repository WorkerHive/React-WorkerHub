import * as types from './types';
import { gql } from '@apollo/client';

import GClient from '../graph';

const client = GClient()

export const UPDATE_INTEGRATION_MAP = gql`
  mutation UpdateIntegrationMap($nodes: [MapNodeInput], $links: [MapLinkInput]){
    updateIntegrationMap(nodes: $nodes, links: $links){
      nodes{
        id
        type
        data
        position{
          x
          y
        }
      }
      links{
        id
        target
        source
      }
    }
  }
`

export const getPermissions = () => {
  return (dispatch) => {
    return client.query({
      query: gql`
      query GetPermissions{
        typePermissions{
          type
          create
          read
          update
          delete
        }
      }
      `
    }).then((r) => r.data.typePermissions).then((r) => {
      console.log(r)
      dispatch({type: types.SET_DASHBOARD_PERMS, perms: r})
    })
  }
}

export const getIntegrationMap = () => {
  return client.query({
    query: gql`
      query GetIntegrations{
        integrationMap{
          nodes{
            id
            type
            data
            position{
              x
              y
            }
          }
          links{
            id
            target
            source
          }
        }
      }
    `
  }).then((r) => r.data.integrationMap)
}

export const getTypes = () => {
  return (dispatch, getState) => {
    return client.query({
      query: gql`
        query GetTypes{
          adminTypes{
            name
            typeDef
          }
        }
      `
    }).then((r) => r.data.adminTypes).then((r) => {
      console.log(r)
      dispatch({type: types.SET_DASHBOARD_TYPES, types: r})
    })
  }
 
}

export const getTables = (store) => {
    return client.query({
      query: gql`
        query GetLayout{
          connectionLayout(storeId: "${store}"){
            name
          }
        }
      `
    }).then((r) => {
      return r.data.connectionLayout;
    })
}

export const getColumns = (store, table) => {
    return client.query({
        query: gql`
          query GetProjects {
            bucketLayout(storeId: "${store}", bucketId: "${table}"){
              name
              datatype
            }
          }
        `
      }).then((r) => {
        return r.data.bucketLayout;
      })
}

export const getViews = () => {
    return client.query({
        query: gql`
          query GetProjects {
            getSQLViews{
              name
            }
          }
        `
      }).then((r) => {
        return r.data.getSQLViews;
      })
}

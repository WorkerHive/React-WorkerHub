import * as types from './types';
import { gql } from '@apollo/client';

import GClient, {withGraph} from '../graph';

const graph = withGraph()

export const updateIntegrationMap = (nodes, links) => {
  return graph.getClient().mutate({
    mutation: gql`
    mutation UpdateIntegrationMap($nodes: [MapNodeInput], $links: [MapLinkInput]){
      updateIntegrationMap(id: "root", integrationMap: {nodes: $nodes, links: $links}){
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
  `,
  variables: {
    nodes: nodes, 
    links: links
  }
  }).then((r) => r.data.updateIntegrationMap)
 
}

export const getStoreTypes = () => {
  return graph.getClient().query({
    query: gql`
      query GetStoreTypes{
        storeTypes{
          id
          name
          description
        }
      }
    `
  }).then((r) => r.data.storeTypes);
}

export const getStores = () => {
  return (dispatch) => {
    return graph.getClient().query({
      query: gql`
        query GetStores{
          integrationStores{
            id
            name
            type {
              id
              
            }
            host
            user
            pass
            dbName
          }
        }
      ` 
    }).then((r) => r.data.integrationStores).then((r) => {
      dispatch({type: types.SET_STORES, stores: r})
    })
  }
}

export const addStore = (store) => {
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation AddStore ($store: IntegrationStoreInput){
          addIntegrationStore(integrationStore: $store){
            id
            name
            type{ 
              id
            }
            host
            user
            pass
            dbName
          }
        }
      `,
      variables: {
        store: store
      }
    }).then((r) => r.data.addIntegrationStore).then((r) => {
      dispatch({type: types.ADD_STORE, newStore: r})
    })
  }
}


export const updateStore = (id, store) => {
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation UpdateStore($id: ID, $store: IntegrationStoreInput){
          updateIntegrationStore(id: $id, integrationStore: $store){
            id
            name
            type{
              id
            }
            host
            user
            pass
            dbName
          }
        }
      `,
      variables: {
        id: id,
        store: store
      }
    }).then((r) => r.data.updateIntegrationStore).then((r) => {
      dispatch({type: types.UPDATE_STORE, id: id, store: r})
    });
  }
}

export const deleteStore = (id) => {
  return (dispatch) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation DeleteStore($id: ID){
          deleteIntegrationStore(id: $id)
        }
      `,
      variables: {id}
    }).then((r) => r.data.deleteIntegrationStore).then((r) => {
      dispatch({type: types.DELETE_STORE, id: id})
    })
  }
}

export const getPermissions = () => {
  return (dispatch) => {
    return graph.getClient().query({
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
  return graph.getClient().query({
    query: gql`
      query GetIntegrations{
        integrationMap(id:"root"){
          nodes {
            id
            type
            data
            position {
              x 
              y
            }
          }
          links {
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
    return graph.getClient().query({
      query: gql`
        query GetTypes{
          adminTypes{
            types {
              name
              typeDef
            }
            inputs {
              name
              typeDef
            }
          }
        }
      `
    }).then((r) => r.data.adminTypes).then((r) => {
      console.log("TYPES", r)
      dispatch({type: types.SET_DASHBOARD_TYPES, types: r.types})
    })
  }
 
}

export const getTables = (store) => {
    return graph.getClient().query({
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
    return graph.getClient().query({
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
    return graph.getClient().query({
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

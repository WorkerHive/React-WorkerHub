import * as types from './types';
import { gql } from '@apollo/client';

import {withGraph} from '../graph';

const graph = withGraph()

export const updateIntegrationMap = (nodes : Array<any>, links : Array<any>) => {
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
  }).then((r : any) => r.data.updateIntegrationMap)
 
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
  }).then((r : any) => r.data.storeTypes);
}

export const getStores = () => {
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.integrationStores).then((r : any) => {
      dispatch({type: types.SET_STORES, stores: r})
    })
  }
}

export const addStore = (store : any) => {
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.addIntegrationStore).then((r : any) => {
      dispatch({type: types.ADD_STORE, newStore: r})
    })
  }
}


export const updateStore = (id : any, store : any) => {
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.updateIntegrationStore).then((r : any) => {
      dispatch({type: types.UPDATE_STORE, id: id, store: r})
    });
  }
}

export const deleteStore = (id : string) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: gql`
        mutation DeleteStore($id: ID){
          deleteIntegrationStore(id: $id)
        }
      `,
      variables: {id}
    }).then((r : any) => r.data.deleteIntegrationStore).then((r : any) => {
      dispatch({type: types.DELETE_STORE, id: id})
    })
  }
}

export const getPermissions = () => {
  return (dispatch : any) => {
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
    }).then((r : any) => r.data.typePermissions).then((r : any) => {
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
  }).then((r : any) => r.data.integrationMap)
}

export const getTypes = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
      query: gql`
        query GetTypes{
          mutableTypes{
            name
            def
          }
        }
      `
    }).then((r : any) => r.data.mutableTypes).then((r : any) => {
      console.log("TYPES", r)
      dispatch({type: types.SET_DASHBOARD_TYPES, types: r})
    })
  }
 
}

export const getTables = (store : string) => {
    return graph.getClient().query({
      query: gql`
        query GetLayout($storeId: ID){
          connectionLayout(storeId: $storeId){
            name
          }
        }
      `,
      variables: {
        storeId: store
      }
    }).then((r : any) => {
      return r.data.connectionLayout;
    })
}

export const getColumns = (store : string, table : string) => {
    return graph.getClient().query({
        query: gql`
          query GetProjects($storeId: ID, $bucketId: String) {
            bucketLayout(storeId: $storeId, bucketId: $bucketId){
              name
              datatype
            }
          }
        `,
        variables: {
          storeId: store,
          bucketId: table
        }
      }).then((r: any) => {
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
      }).then((r : any) => {
        return r.data.getSQLViews;
      })
}

import * as types from './types';
import { gql } from '@apollo/client';

import {withGraph} from '../graph';

const graph = withGraph()

export const login = (username : string, password : string) => {
    return graph.getClient().mutate({
        mutation: gql`
        mutation Login($username: String, $password: String){
            login(username: $username, password: $password){
            token
            error
        }
    }
    `,
    variables: {
        username,
        password
    }
    }).then((r : any) => r.data.login)
}

export const getNodeConf = () => {
    return (dispatch : any) => {
        return graph.getClient().mutate({
            mutation: gql`
                mutation GetNode{
                    connectNode{
                        swarmKey
                        peerDiscovery
                    }
                }
            `
        }).then((r : any) => r.data.connectNode).then((r : any) => {
            dispatch({type: types.SET_NODE_CONF, swarmKey: r.swarmKey})
        })
    }
}

export const setToken = (token : string) => {
    return (dispatch : any) => {
        dispatch({type: types.SET_TOKEN, token: token})
    }
}

export const setStatus = (status : string) => {
    return (dispatch : any) => {
        dispatch({type: types.SET_STATUS, status: status})
    }
}
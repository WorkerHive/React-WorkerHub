import * as types from './types';
import { gql } from '@apollo/client';

import GClient, {withGraph} from '../graph';

const graph = withGraph()

export const login = (username, password) => {
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
    }).then((r) => r.data.login)
}

export const getNodeConf = () => {
    return (dispatch) => {
        return graph.getClient().mutate({
            mutation: gql`
                mutation GetNode{
                    connectNode{
                        swarmKey
                        peerDiscovery
                    }
                }
            `
        }).then((r) => r.data.connectNode).then((r) => {
            dispatch({type: types.SET_NODE_CONF, swarmKey: r.swarmKey})
        })
    }
}

export const setToken = (token) => {
    return (dispatch) => {
        dispatch({type: types.SET_TOKEN, token: token})
    }
}

export const setStatus = (status) => {
    return (dispatch) => {
        dispatch({type: types.SET_STATUS, status: status})
    }
}
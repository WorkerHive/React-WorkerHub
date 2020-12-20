import * as types from './types';
import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($username: String, $password: String){
        login(username: $username, password: $password){
            token
            error
        }
    }
`

export const getQuote = () => {
    return fetch('https://zenquotes.io/api/today').then((r) => r.json())
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
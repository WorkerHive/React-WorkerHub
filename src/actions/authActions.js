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

export const setToken = (token) => {
    return (dispatch) => {
        dispatch({type: types.SET_TOKEN, token: token})
    }
}
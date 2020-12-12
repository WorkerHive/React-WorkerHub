import * as types from './types';
import { gql, useMutation } from '@apollo/client';

import GClient from '../graph';

const client = GClient()

export const UPLOAD_FILE = gql`
    mutation UploadFile($file: Upload!){
      uploadFile(file: $file) {
        duplicate
        file{
          id
          filename
          cid
          extension
        }
      }
    }
  `

export const CONVERT_FILE = gql`
    mutation ConvertFile($fileId: ID, $targetFormat:String){
      convertFile(fileId: $fileId, targetFormat: $targetFormat){
        msg
        error
      }
    }
`

export const addFile = (file) => {
  return (dispatch) => {
    dispatch({type: types.ADD_FILE, file: file})
  }
}

export const getFiles = () => {
  return (dispatch, getState) => {
    return client.query({
      query: gql`
        query GetFiles{
          files{
            id
            filename
            cid
            extension
          }
        }
      `
    }).then((r) => r.data.files).then((r) => {
      dispatch({type: types.SET_FILES, files: r})
    })
  }
}


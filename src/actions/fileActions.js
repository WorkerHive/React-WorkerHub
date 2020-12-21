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

export const uploadFile = (file, cb) => {
  return (dispatch) => {
    return client.mutate({
      mutation: UPLOAD_FILE,
      variables: {
        file: file
      }
    }).then((r) => r.data.uploadFile).then((r) => {
      console.log("Upload file")
      cb(r.file)
      if(!r.duplicate){
        dispatch(addFile(r.file))
      }
    })
  }
}

export const attachFile = (projectId, fileId) => {
  client.mutate({
    mutation: gql`
    mutation AttachFile($projectId: ID, $fileId: ID){
      attachFileToProject(projectId: $projectId, fileId: $fileId){
        files{
          cid
        }
      }
    }
    `,
    variables: {
      projectId: projectId,
      fileId: fileId
    }
  }).then((r) => r.data.attachFileToProject).then((r) => {
      console.log(r)
  }) 
}

export const convertFile = (fileId, targetFormat) => {
  client.mutate({
    mutation: gql`
    mutation ConvertFile($fileId: ID, $targetFormat:String){
      convertFile(fileId: $fileId, targetFormat: $targetFormat){
        msg
        error
      }
    }
  `,
    variables: {
      fileId,
      targetFormat
    }
  }).then((r) => r.data.convertFile)
}

export const getConverters = () => {
  return client.query({
    query: gql`
      query GetConverters{
        converters{
          id
          name
          sourceFormat
          targetFormat
          installed
        }
      }
    `
  }).then((r) => r.data.converters)
}

export const installConverter = (id) => {
  return client.mutate({
    mutation: gql`
      mutation InstallConverter($converterId: ID){
        installConverter(converterId: $converterId)
      }
    `,
    variables: {
      converterId: id
    }
  })
}

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
            conversion{
              extension
              cid
            }
          }
        }
      `
    }).then((r) => r.data.files).then((r) => {
      dispatch({type: types.SET_FILES, files: r})
    })
  }
}


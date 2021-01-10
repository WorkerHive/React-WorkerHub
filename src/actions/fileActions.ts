import * as types from './types';
import { gql } from '@apollo/client';

import {withGraph} from '../graph';

const graph = withGraph()

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

export const uploadFile = (file : File, cb: any) => {
  return (dispatch : any) => {
    return graph.getClient().mutate({
      mutation: UPLOAD_FILE,
      variables: {
        file: file
      }
    }).then((r : any) => r.data.uploadFile).then((r : any) => {
      console.log("Upload file")
      if(cb) cb(r.file)
      if(!r.duplicate){
        dispatch(addFile(r.file))
      }
    })
  }
}

export const attachFile = (projectId : string, fileId: string) => {
  graph.getClient().mutate({
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
  }).then((r:any) => r.data.attachFileToProject).then((r:any) => {
      console.log(r)
  }) 
}

export const convertFile = (fileId:string, targetFormat:string) => {
  graph.getClient().mutate({
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
  }).then((r : any) => r.data.convertFile)
}

export const getConverters = () => {
  return graph.getClient().query({
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
  }).then((r : any) => r.data.converters)
}

export const installConverter = (id : string) => {
  return graph.getClient().mutate({
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

export const addFile = (file : any) => {
  return (dispatch : any) => {
    dispatch({type: types.ADD_FILE, file: file})
  }
}

export const getFiles = () => {
  return (dispatch : any) => {
    return graph.getClient().query({
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
    }).then((r: any) => r.data.files).then((r:any) => {
      dispatch({type: types.SET_FILES, files: r})
    })
  }
}


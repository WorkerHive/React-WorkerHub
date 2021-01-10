import React, { useCallback } from 'react';

import {
  LinearProgress,
} from '@material-ui/core';

import { FileBrowser, PermissionForm, Header } from '@workerhive/react-ui'

import { addFile, getFiles, uploadFile } from '../../actions/fileActions';
import { connect } from 'react-redux';

import './index.css';

const FilePreviewDialog = require('../../components/dialogs/file-preview-dialog')
const FileUploadDialog = require('../../components/dialogs/file-upload-dialog')
const ConverterDialog = require('../../components/dialogs/converter-dialog')

export interface FilesProps {
  uploadFile: Function;
  getFiles: Function;
  type: any;
  permissions: any;
  files: any;
}

const Files: React.FC<FilesProps> = (props) => {
  const [progress, setProgress] = React.useState<number>(0)
  const [dialogOpen, openDialog] = React.useState(false);
  const [convertDoc, setConvertDoc] = React.useState(null)
  const [selectedData, setData] = React.useState<any>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {

      Promise.all(acceptedFiles.map((x) => {
        return (async () => {
          props.uploadFile(x)
        })()
      }))
    }
    // Do something with the files
  }, [props])

  const [viewable] = React.useState(["pdf", "glb", "png"])
  React.useEffect(() => {
    props.getFiles()
  }, [])

  return (
    <>
      <Header
        tabs={[]}
        selectedTab={''}
        onTabSelect={(tab: any) => {
          //setSelectedTab(tab)
          //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
        }}
        title={"Files"} />

      <PermissionForm
        type={props.type}
        permissions={props.permissions}
      >
        {progress != null && <LinearProgress variant="determinate" value={progress} />}

        <div className={false ? 'file-list selected' : 'file-list'} >

          <FileBrowser
            loading={false}
            onFileDownload={() => { }}
            title={"File"}
            onUploadFiles={() => openDialog(true)}
            onFileUpload={onDrop}
            onDownloadProgress={(progress: any) => {
              setProgress(progress)
            }}
            onConvertFiles={(files: any) => {
              if (files.length > 0) {
                setConvertDoc(files[0])
              }

            }}
            onDownloadEnd={() => setProgress(0)}
            onFileOpen={(file: any) => {
              if (viewable.indexOf(file.extension) > -1) {
                return setData({ filename: file.name, cid: file.cid, extension: file.extension })
              }
              if (file.conversion && viewable.indexOf(file.conversion.extension) > -1) {
                return setData({ filename: file.name, cid: file.conversion.cid, extension: file.conversion.extension })
              }
            }} files={props.files} />

        </div>
      </PermissionForm>
    </>
  )
}

export default connect((state: any) => ({
  files: state.files.list,
}), (dispatch: any) => ({
  addFile: (file: any) => dispatch(addFile(file)),
  getFiles: () => dispatch(getFiles()),
  uploadFile: (file: any, cb: any) => dispatch(uploadFile(file, cb))
}))(Files)

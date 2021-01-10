import React, {useCallback} from 'react';

import {
  Add,
  MoreVert,
  Contactless,
  Info
} from '@material-ui/icons';

import {
  Paper,
  LinearProgress,
  Fab,
  List,
  IconButton,
  ListItem,
  Divider,
  Checkbox
} from '@material-ui/core';

import { FileBrowser, PermissionForm, Header } from '@workerhive/react-ui'

import { addFile, getFiles, uploadFile } from '../../actions/fileActions';
import {useDropzone} from 'react-dropzone'
import { connect } from 'react-redux';

import './index.css';

const FilePreviewDialog = require('../../components/dialogs/file-preview-dialog')
const FileUploadDialog = require('../../components/dialogs/file-upload-dialog')
const ConverterDialog = require('../../components/dialogs/converter-dialog')

export interface FilesProps{
  uploadFile: Function;
  getFiles: Function;
  type: any;
  permissions: any;
  files: any;
}

const Files : React.FC<FilesProps> = (props) => {
  const [ progress, setProgress ] = React.useState<number>(0)
  const [ dialogOpen, openDialog ] = React.useState(false);
  const [ convertDoc, setConvertDoc ] = React.useState(null)
  const [ selectedData, setData ] = React.useState<any>(null)

  const onDrop = useCallback(async (acceptedFiles : File[]) => {
    if(acceptedFiles && acceptedFiles.length > 0){
      
      Promise.all(acceptedFiles.map((x) => {
        return (async () => {
          props.uploadFile(x)
        })()
      }))     
    }
    // Do something with the files
  }, [])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})

  const [ files, setFiles ] = React.useState([])
  const [ viewable ] = React.useState(["pdf", "glb", "png"])
  React.useEffect(() => {
    props.getFiles()
  }, [])

  return (
    <>
    <Header 
    tabs={[]}
    onTabSelect={(tab : any) => {
        //setSelectedTab(tab)
        //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={''}
    title={"Files"} />

    <PermissionForm
      style={{marginTop: 12}}
      type={props.type}
      permissions={props.permissions}
      >
        {progress != null && <LinearProgress variant="determinate" value={progress} />}

        <FilePreviewDialog open={selectedData} file={selectedData} onClose={() => setData(null)} />
        <ConverterDialog open={convertDoc} selected={convertDoc} onClose={() => setConvertDoc(null)}/>
        <FileUploadDialog open={dialogOpen} onClose={() => openDialog(false)} />
        <div className={isDragActive ? 'file-list selected' : 'file-list'} >
        
        <FileBrowser 
          loading={false}
          onFileDownload={() => {}}
          title={"File"}
          onUploadFiles={() => openDialog(true)}
          onFileUpload={onDrop}
          onDownloadProgress={(progress : any) => {
            setProgress(progress)
          }}
          onConvertFiles={(files : any) => {
            if(files.length > 0){
              setConvertDoc(files[0])
            }
           
          }}
          onDownloadEnd={() => setProgress(0)}
          onFileOpen={(file :any) => {
            if(viewable.indexOf(file.extension) > -1){
              return setData({filename: file.name, cid: file.cid, extension: file.extension})
            }
            if(file.conversion && viewable.indexOf(file.conversion.extension) > -1){
              return setData({filename: file.name, cid: file.conversion.cid, extension: file.conversion.extension})
            }
        }} files={props.files} />
        {/*<SearchTable 
          data={props.files}
          renderItem={(x) => (
            <div className="file-item">
              <ListItem button onClick={(e) => {
                e.stopPropagation();
                if(viewable.indexOf(x.extension) > -1 ||(x.conversion && viewable.indexOf(x.conversion.extension) > -1)){
               //   alert("Viewable")
                  let file = {}
                  if(viewable.indexOf(x.extension) > -1){
                    file = {
                      filename: x.filename,
                      cid: x.cid,
                      extension: x.extension
                    }
                  }else if(x.conversion && viewable.indexOf(x.conversion.extension) > -1){
                    file = {
                      filename: x.filename,
                      cid: x.conversion.cid,
                      extension: x.conversion.extension
                    }
                  }
                  setData(file)
                }
         
                /*
                if(props.ipfs){
                  const get = async (x) => {
                    if(props.ipfs){
                      console.log(x)
                      let file =  props.ipfs.cat(x.cid)
                      let data = Buffer.from('')
                      for await (const chunk of file){
                        data = Buffer.concat([data, chunk])
                      }
                      setData({
                        filename: x.filename,
                        extension: x.extension,
                        content: data
                      })
                     // console.log(data)
                    }
                    
                  }
                  //get(x)

                
              }}>
                 <Checkbox onClick={(e) => {
              e.stopPropagation();
            }}/>  
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
              <div>{x.filename}</div>
              <span style={{fontSize: 10}}>{x.cid}</span>
            </div>
              </ListItem>
              <MoreMenu 
              menu={[
                {
                  label: "Convert",
                  icon: <Contactless />,
                  action: () => {
                    setConvertDoc(x)
                  }
                },
                {
                  label: "Get Info",
                  icon: <Info />,
                  action: () => {}
                }
              ]} />
            </div>
          )}/>*/}
          </div>
    </PermissionForm>
    </>
  )
}

export default connect((state : any) => ({
  files: state.files.list,
}), (dispatch : any) => ({
  addFile: (file : any) => dispatch(addFile(file)),
  getFiles: () => dispatch(getFiles()),
  uploadFile: (file : any, cb: any) => dispatch(uploadFile(file, cb))
}))(Files)

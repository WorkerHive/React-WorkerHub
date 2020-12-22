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
import MoreMenu from '../../components/more-menu'
import DashboardHeader from '../../components/dashboard-header';
import PermissionForm from '../../components/permission-form';
import SearchTable from '../../components/search-table';

import FileBrowser from '../../components/file-browser';

import FilePreviewDialog from '../../components/dialogs/file-preview-dialog';
import FileUploadDialog from '../../components/dialogs/file-upload-dialog';
import ConverterDialog from '../../components/dialogs/converter-dialog';

import { useMutation } from '@apollo/client';
import { addFile, CONVERT_FILE, getFiles, UPLOAD_FILE } from '../../actions/fileActions';
import {useDropzone} from 'react-dropzone'
import { connect } from 'react-redux';

import './index.css';

function Files(props){
  const [ progress, setProgress ] = React.useState(null)
  const [ dialogOpen, openDialog ] = React.useState(false);
  const [ uploadFile, {data} ] = useMutation(UPLOAD_FILE)
  const [ convertDoc, setConvertDoc ] = React.useState(null)
  const [ selectedData, setData ] = React.useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    if(acceptedFiles && acceptedFiles.length > 0){
      console.log(acceptedFiles)
      uploadFile({variables: {file: acceptedFiles[0]}}).then((r) => {
        if(r.data && r.data.uploadFile && !r.data.uploadFile.duplicate){
          props.addFile(r.data.uploadFile.file)
        }
      })
     
    }
    // Do something with the files
  }, [data])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})

  const [ files, setFiles ] = React.useState([])
  const [ viewable ] = React.useState(["pdf", "glb", "png"])
  React.useEffect(() => {
    props.getFiles()
  }, [])

  return [
    <DashboardHeader 
    tabs={[]}
    onTabSelect={(tab) => {
        //setSelectedTab(tab)
        //props.history.push(`${props.match.url}/${tab.toLowerCase()}`)
    }}
    selectedTab={''}
    title={"Files"} />,

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
        <Fab color="primary" onClick={() => openDialog(true)} style={{zIndex: 12, position: 'absolute', right: 12, bottom: 12}}>
          <Add />
        </Fab>
        <FileBrowser 
          onDownloadProgress={(progress) => {
            setProgress(progress)
          }}
          onDownloadEnd={() => setProgress(null)}
          onFileOpen={(file) => {
            if(viewable.indexOf(file.extension) > -1){
              setData({filename: file.name, cid: file.cid, extension: file.extension})
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
  ]
}

export default connect((state) => ({
  files: state.files.list,
}), (dispatch) => ({
  addFile: (file) => dispatch(addFile(file)),
  getFiles: () => dispatch(getFiles())
}))(Files)

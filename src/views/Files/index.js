import React, {useCallback} from 'react';

import {
  Add,
  MoreVert
} from '@material-ui/icons';

import {
  Paper,
  Fab,
  List,
  IconButton,
  ListItem,
  Divider,
  Checkbox
} from '@material-ui/core';
import DashboardHeader from '../../components/dashboard-header';
import PDFCard from '../../components/pdf-card';
import FilePreview from '../../components/file-preview-dialog';
import { useMutation } from '@apollo/client';
import { addFile, CONVERT_FILE, getFiles, UPLOAD_FILE } from '../../actions/fileActions';
import {useDropzone} from 'react-dropzone'
import { connect } from 'react-redux';

import './index.css';

function Files(props){
  const [ uploadFile, {data} ] = useMutation(UPLOAD_FILE)
  const [ convertFile ] = useMutation(CONVERT_FILE)
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


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const [ files, setFiles ] = React.useState([])

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
    <Paper style={{marginTop: 12, flex: 1, position: 'relative', display: 'flex', flexDirection: 'column'}}>
      <FilePreview open={selectedData} onClose={() => setData(null)} file={selectedData} />
      <div {...getRootProps()} style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <input {...getInputProps()} />
      <List className={isDragActive ? 'file-list selected' : 'file-list'}>
        {props.files.map((x) => [
          <ListItem button onClick={(e) => {
            e.stopPropagation();
            let vars = {
              fileId: x.id,
              targetFormat: "glb"
            }
            console.log(vars)
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
              get(x)
            }
            //convertFile({variables: vars})
          }}>
            <Checkbox onClick={(e) => {
              e.stopPropagation();
            }}/>  
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
              <div>{x.filename}</div>
              <span style={{fontSize: 10}}>{x.cid}</span>
            </div>
            <IconButton onClick={(e) => {
              e.stopPropagation()
            }}>
              <MoreVert />
            </IconButton>
          </ListItem>,
          <Divider />
        ])}
        </List>
      </div>
      <Fab style={{position: 'absolute', right: 8, bottom: 8}} color="primary" >
        <Add />
      </Fab>
    </Paper>
  ]
}

export default connect((state) => ({
  files: state.files.list
}), (dispatch) => ({
  addFile: (file) => dispatch(addFile(file)),
  getFiles: () => dispatch(getFiles())
}))(Files)

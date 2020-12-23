import React, {useCallback, useMemo} from 'react';

import { ChonkyActions, EssentialFileActions, FileHelper, FileBrowser, FileNavbar, FileContextMenu, FileList, FileToolbar, FullFileBrowser } from 'chonky';

import { useCustomFileMap, useFiles } from './file-hooks'

import {
    Backup
} from '@material-ui/icons'

import FileDrop from '../file-drop';

import FolderDialog from './folder-dialog'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

import { Typography } from '@material-ui/core'
import Spinner from 'react-spinkit';

import { withIPFS } from '../../graph/ipfs';
import { connect } from 'react-redux';
import async from 'async'
import { saveAs } from 'file-saver';
import downloadjs from 'downloadjs'

import { useDropzone } from 'react-dropzone'

import './index.css';


function WorkhubFileBrowser(props){

    const [ files, setFiles ] = React.useState([])

    const [ folderDialog, dialogFolder ] = React.useState(false)
    const [ folderChain, setFolderChain ] = React.useState([{id: 'default', name: props.title || 'File Storage', isDir: true}])

    const fileActions = React.useMemo(
        () => [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles],
        []
    );

    React.useEffect(() => {
        if(props.files && props.ipfs.isReady){
            let f = props.files.slice()

            console.log("File Browser", f.length)
            const getStat = (x, cb) => {
                props.ipfs.node.files.stat(`/ipfs/${x.cid}`, {timeout: 2 * 1000}).then((stat) => {
                    console.log(stat)
                    cb(null, {
                        ...x,
                        size: stat.size
                    })
                }).catch((err) => {
                    cb(null)
                    console.log(err)
                })
               
              //  cb(null, {...x, size: stat.size})
            }

            setFiles(f)
           /* async.map(f, getStat, (err, _files) => {
                console.log("_FILES", _files, err)
                setFiles(_files)
            })*/
            
        }
    }, [props.files, props.ipfs])

    const onFileAction = (action) => {
        switch(action.id){
            case "create_folder":
                dialogFolder(true)
                break;
            case 'upload_files':
                if(props.onUploadFiles) props.onUploadFiles();
                break;
            case "open_files":
                if(action.payload.targetFile.isDir){
                    console.log("DsIR")
                }else{
                    if(props.onFileOpen) props.onFileOpen(action.payload.targetFile)
                }
                break;
            case "download_files":
                let files = action.state.selectedFiles;
                
                let downloadSize = files.map((x) => x.size).reduce((a, b) => a+b)

                
                let progress = 0;

                async.map(files, (file, cb) => {
                    (async () => {
                        let buff = Buffer.from('')
                        for await (const chunk of props.ipfs.node.cat(file.cid)){
                            buff = Buffer.concat([buff, chunk])
                            progress += chunk.length
                            props.onDownloadProgress((progress / downloadSize) * 100)
                        }
                        cb(null, {
                            ...file,
                            content: buff
                        })
                    })()
                }, (err, results) => {
                    console.log(results)
                    props.onDownloadEnd()
                    if(results.length == 1){
                        downloadjs(new Blob([results[0].content]), results[0].name)
                    }else{

                        let zip = JSZip()

                        for(var i = 0; i < results.length; i++){
                            console.log("Add ", results[i].name, results[i].content.length)
                            zip.file(results[i].name, results[i].content, {binary: true})
                        }
                        zip.generateAsync({type: 'blob'}).then((content) => {
                            console.log(content)
                            saveAs(content, "workhub-download.zip")
                        })
                    }
                })

                /*if(files.length == 1){
                    (async () => {
                        let size = files[0].size;
                        
                        let progress = 0;

                        let buff = Buffer.from('')
                        for await(const chunk of ipfs.cat(files[0].cid)){
                            if(props.onDownloadProgress) props.onDownloadProgress(((progress + chunk.length) / size) * 100)
                            console.log("=> Chunking ", ((progress + chunk.length) / size) * 100)
                            progress += chunk.length
                            buff = Buffer.concat([buff, chunk])
                        }
                        props.onDownloadEnd()
                        downloadjs(new Blob([buff]), files[0].name)
                    })()
                }*/
                break;
            default:
                break;
        }
    }

    const [ folders, setFolders ] = React.useState([])

    return (
        <div className="workhub-fs">
            <FolderDialog 
                open={folderDialog} 
                onAdd={(name) => setFolders(folders.concat([{
                    id: uuidv4(),
                    filename: name,
                    isDir: true
                }]))}
                onClose={() => dialogFolder(false)} />

            <FileBrowser 
                fileActions={[ChonkyActions.CreateFolder, ChonkyActions.UploadFiles, ChonkyActions.DownloadFiles]}
                disableDragAndDropProvider={true}
                instanceId="workhub-fs"
                onFileAction={onFileAction}
                files={(files || []).filter((a) => a && (a.filename || a.name)).concat(folders).map((x, ix) => ({
                    id: x.id,
                    cid: x.cid,
                    size: x.size,
                    ext: x.extension,
                    extension: x.extension,
                    isDir: x.isDir,
                    name: x.id ? x.filename : x.name
                }))}
                 folderChain={folderChain} >
                        <FileNavbar />
                        <FileToolbar />

                        <FileContextMenu />
                        <FileDrop noClick onDrop={props.onFileUpload} >
                            {isDragActive => {
                                return [
                                    <FileList />,
                                    isDragActive && (
                                        <div className="ipfs-loader">
                                            <Backup style={{fontSize: 44}} />
                                            <Typography variant="h6" style={{fontWeight: 'bold'}}>Drop files here</Typography>
                                        </div>
                                    )]
                            }}
                        
                        </FileDrop> 
                           


            </FileBrowser>
            {!props.ipfs.isReady && (
                    <div className="ipfs-loader">
                        <Spinner />
                        <Typography variant="h6" style={{fontWeight: 'bold'}}>Loading file network</Typography>
                    </div>
                )}
        </div>
    )
}

export default withIPFS(WorkhubFileBrowser)
import React from 'react';

import { FullFileBrowser } from 'chonky';

import './index.css';

export default function FileBrowser(props){
    const [ files, setFiles ] = React.useState([])
    const [ folderChain, setFolderChain ] = React.useState([{id: 'default', name: props.title, isDir: true}])


    return (
        <div className="workhub-fs">
            <FullFileBrowser files={(props.files || []).map((x) => ({id: x.cid, name: x.filename || x.name}))} folderChain={folderChain} />
        </div>
    )
}


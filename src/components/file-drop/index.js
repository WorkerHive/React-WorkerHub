import React from 'react';

import './index.css';

import { useDropzone } from 'react-dropzone';

export default function FileDrop(props){

    const onDrop = React.useCallback(acceptedFiles => {
        console.log(acceptedFiles)
        if(props.onDrop) props.onDrop(acceptedFiles)
    })

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: props.noClick || false})

    return (
        <div className={`file-drop ${isDragActive && 'active'}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {props.children && props.children(isDragActive)}
        </div>
    )
}

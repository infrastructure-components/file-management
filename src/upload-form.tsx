import React from 'react';

import styled, { withTheme } from 'styled-components';

import { callService, uploadFile } from 'infrastructure-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import {TextDecoder} from "util";

const upload = (file) => uploadFile(
    "FILESTORAGE",
    file,
    //onProgess: (uploaded: number) => Boolean,
    uploaded => {
        const percent_done = Math.floor( ( uploaded / file.size ) * 100 );
        console.log("Uploading File - " + percent_done + "%");
        return true;
    },
    //onComplete: (uri: string) => void,
    uri => console.log(uri),

    //onError: (err: string) => void
    err => console.log(err)

);

const uploadAll = (arr) => {
    Object.values(arr).filter(item => item.kind === 'file').forEach(item => upload(item.getAsFile()));
    return true;
}

const Dropzone  = (props) => {
    const borderWidth = "2px";
    const inputId = "uploadfile";

    const UploadFrame = withTheme(styled.label`
        margin: auto;
        width: calc(100% - 2 * ${props => props.theme.outerMargin} - 2 * ${borderWidth});
        padding: 10px 0;
        background-color: #fff;
        border: ${borderWidth} dashed #888;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        
        &:hover {
            background-color: #ADA;
            cursor: pointer;
        }
    `);

    const UploadInput = styled.input`
        display: none;
    `;


    const onFileSelected = event => {

        console.log(event.target.files);
        upload(event.target.files[0]);
    };


    return <UploadFrame {...props} htmlFor={inputId} >
        <UploadInput type="file" name={inputId} id={inputId} onChange={onFileSelected}/>
        {
            props.children
        }
    </UploadFrame>
};

function dragOverHandler(ev) {
    //console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function dropHandler(ev) {
    //console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        console.log(ev.dataTransfer.items);
        uploadAll(ev.dataTransfer.items);
    } else {
        upload(ev.dataTransfer.files);
    }

}

export default function () {
    return <Dropzone onDrop={dropHandler} onDragOver={dragOverHandler}>
        <FontAwesomeIcon icon={faFileUpload} size="4x" color="#888"/>
        <span>Upload Files</span>


    </Dropzone>
};//<input type="file" onChange={ (e) => console.log(e.target.files) } name="test"/>
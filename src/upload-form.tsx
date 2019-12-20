import React, { useState } from 'react';

import styled, { withTheme, css } from 'styled-components';
import { withRouter } from 'react-router-dom';

import { callService, listFiles } from 'infrastructure-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'


import { upload, withRefetch } from './file-storage';

const uploadAll = (prefix, arr, onUpload) => {
    Object.values(arr).filter(item => item.kind === 'file').forEach(item => upload(prefix, item.getAsFile(), onUpload));
    return true;
}

const borderWidth = "2px";

const LabelFrame = withTheme(styled.label`
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
    
    ${props => props.active ? `&:hover {
        background-color: #ADA;
        cursor: pointer;
    }` :""}
`);

const Dropzone  = withRouter((props) => {

    const inputId = "uploadfile";

    const UploadInput = styled.input`
        display: none;
    `;

    const onFileSelected = event => {
        props.selectFile({
            pathname: props.location.pathname,
            file: event.target.files[0]
        });
    };

    return <LabelFrame {...props} htmlFor={inputId} >
        { props.active && <UploadInput type="file" name={inputId} id={inputId} onChange={onFileSelected}/> }
        {
            props.children
        }
    </LabelFrame>
});

const dropHandler = (location, onUpload) => ev => {
    console.log(location);

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        //console.log(ev.dataTransfer.items);
        uploadAll(location, ev.dataTransfer.items, onUpload);
    } else {
        upload(location, ev.dataTransfer.files, onUpload);
    }
}

function UploadForm (props) {

    const [selectedFile, selectFile] = useState(undefined);

    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");

    return <Dropzone
        active={!selectedFile}
        selectFile={selectFile}
        onDrop={dropHandler(props.location.pathname, props.onUpload)}
        onDragOver={ev =>{ev.preventDefault()}}
    >{
        !selectedFile ? <React.Fragment>
            <link href="https://use.fontawesome.com/releases/v5.9.0/css/svg-with-js.css" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.9.0/css/all.css"></link>
                <FontAwesomeIcon icon={faFileUpload} size="4x" color="#888"/>
                <span >Upload Files</span>
        </React.Fragment> : <>
            <div>{selectedFile.file.name}</div>
            <input
                type="text"
                placeholder="Enter Author"
                value={author}
                onChange={event => setAuthor(event.target.value)}/>

            <input
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={event => setDescription(event.target.value)}/>

            <button onClick={(ev)=>{
                ev.preventDefault();
                upload(
                    selectedFile.pathname,
                    selectedFile.file,
                    () => {
                        props.refetch();
                        selectFile(undefined);
                    }, {
                        author: author,
                        description: description
                    }
                );
            }}>Upload now</button>
            <button onClick={(ev)=>{
                // prevent the label to trigger the file-selection right away
                ev.preventDefault();
                selectFile(undefined);
            }}>Cancel</button>
        </>
    }</Dropzone>
};

export default withRefetch(withRouter(UploadForm));
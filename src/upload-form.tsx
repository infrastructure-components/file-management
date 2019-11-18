import React from 'react';

import styled, { withTheme } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'


const Dropzone = withTheme(styled.div`
    margin: auto;
    width: calc(100% - 2 * ${props => props.theme.outerMargin});
    padding: 10px 0;
    background-color: #fff;
    border: 2px dashed #888;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
`);

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function dropHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
}

export default function () {
    return <Dropzone onDrop={dropHandler} onDragOver={dragOverHandler}>
        <FontAwesomeIcon icon={faFileUpload} size="4x" color="#888"/>
        <span>Upload Files</span>
    </Dropzone>
};//<input type="file" onChange={ (e) => console.log(e.target.files) } name="test"/>
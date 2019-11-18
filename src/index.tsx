import React from 'react';

import {
    Environment,
    Route,
    ServiceOrientedApp
} from "infrastructure-components";

import FileList from './file-list';
import FileStorage from './file-storage';
import UploadForm from './upload-form';
import { FILE_STORAGE_ID } from './file-storage';
import Page from './page';

const folders = [
    {
        name: "Data",
        path: "/"
    }, {
        name: "Documents",
        path: "/documents"
    }, {
        name: "Images",
        path: "/images"
    }, {
        name: "Sub",
        path: "/documents/sub"
    },
];

export default (
    <ServiceOrientedApp
        stackName = "file-management"
        buildPath = 'build'
        region='us-east-1'>

        <Environment name="dev" />

        {/*<FileStorage />

        <Route
            path='/'
            name='Infrastructure-Components'
            render={(props) => <ul>
         <li>
         <a href={logo} download target="_blank">Logo</a>
         </li>
         <li>
         <a href="index.html" download target="_blank">Index</a>
         </li>
         </ul>}
        />*/}

        {
            folders.map((folder, index)=> <Route
                key={`folder-${index}`}
                path={folder.path}
                name={folder.name}
                render={(props) => <Page>
                    <FileList />
                    <UploadForm />
                </Page>}
            />)
        }

    </ServiceOrientedApp>
);
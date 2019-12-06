import React from 'react';
import "@babel/polyfill";

import {
    Environment,
    Route,
    ServiceOrientedApp
} from "infrastructure-components";

import FileList from './file-list';
import UploadForm from './upload-form';
import Page from './page';
import FileStorage from './file-storage';

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
        region='us-est-1'>

        <Environment name="dev" />

        <FileStorage />

        {
            folders.map((folder, index)=> <Route
                key={`folder-${index}`}
                path={folder.path}
                name={folder.name}
                render={(props) => <Page>
                    <FileList/>
                    <UploadForm/>
                </Page>}
            />)
        }

    </ServiceOrientedApp>
);
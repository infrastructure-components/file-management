import React from 'react';
import "@babel/polyfill";

import {
    DataLayer,
    Environment,
    IsomorphicApp,
    Middleware,
    Route,
    WebApp
} from "infrastructure-components";

import FileStorage from './file-storage';
import FileMetaDataEntry from './file-meta-data-entry';
import FolderRoute from './folder-page';

/*
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
];*/


export default (
    <IsomorphicApp
        stackName = "file-management"
        buildPath = 'build'
        assetsPath = 'assets'
        region='us-east-1'>

        <Environment name="dev" />

        <FileStorage />
        <DataLayer id="datalayer">
            <FileMetaDataEntry />


            <WebApp
                id="main"
                path="*"
                method="GET">

                <FolderRoute/>



                {/*
                 <Route
                 path="/folder/:foldername?"
                 name="MyApp"
                 component={Com}
                 />

                    folders.map((folder, index)=> <Route
                        key={`folder-${index}`}
                        path={folder.path}
                        name={folder.name}
                        render={(props) => <Page>
                            <FileList/>
                            <UploadForm/>
                        </Page>}
                    />)
                */}

            </WebApp>

        </DataLayer>
    </IsomorphicApp>
);
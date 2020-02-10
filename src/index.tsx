import React from 'react';

import {
    Environment,
    Route,
    SinglePageApp
} from "infrastructure-components";

import FileList from './file-list';


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
    },
];


export default (
    <SinglePageApp
        stackName = "file-management"
        buildPath = 'build'
        region='us-east-1'>

        <Environment name="dev" />

        {/*<Route
         path='/'
         name='Infrastructure-Components'
         render={(props) => <FileList/>}
         />*/}

        {
            folders.map((folder, index)=> <Route
                key={`folder-${index}`}
                path={folder.path}
                name={folder.name}
                render={(props) => <FileList />}
            />)
        }

    </SinglePageApp>
);

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
    }, {
        name: "Sub",
        path: "/documents/sub"
    },
];

export default (
    <SinglePageApp
        stackName = "file-management"
        buildPath = 'build'
        region='us-east-1'>

        <Environment name="dev" />

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
import React from 'react';
import "@babel/polyfill";

import {
    Authentication,
    AuthenticationProvider,
    DataLayer,
    Environment,
    Identity,
    IsomorphicApp,
    Middleware,
    Route,
    WebApp
} from "infrastructure-components";

import FileStorage from './file-storage';
import FileMetaDataEntry from './file-meta-data-entry';
import FolderRoute from './folder-page';
import LoginRoute from './login-page';
import FileListService from './file-list-service';

export const SENDER_EMAIL = "mail@react-architect.com";


export default (
    <IsomorphicApp
        stackName = "file-management"
        buildPath = 'build'
        assetsPath = 'assets'
        region='eu-west-1'
        iamRoleStatements={[{
            "Effect": "Allow",
            "Action": ['"ses:SendEmail"', '"ses:SendRawEmail"',],
            "Resource": `"arn:aws:ses:eu-west-1:604800795243:identity/react-architect.com"`,
        }]}>

        <Environment name="dev" />

        <FileStorage />
        <DataLayer id="datalayer">
            <Identity >
                <Authentication
                    id="emailauth"
                    provider={AuthenticationProvider.EMAIL}
                    loginUrl="/login"
                    callbackUrl="/authentication"
                    senderEmail={SENDER_EMAIL}
                    getSubject={(recipient: string) => `Confirm Your Mail-Address`}
                    getHtmlText={(recipient: string, url: string) => {
                        return `Hello ${recipient},<br/>
Please verify your e-mail address by following <a href="${url}">this link</a></p>`
                    }}>

                    <FileMetaDataEntry />
                    <FileListService/>

                    <WebApp
                        id="main"
                        path="*"
                        method="GET">

                        <LoginRoute/>
                        <FolderRoute/>


                    </WebApp>
                </Authentication>
            </Identity>
        </DataLayer>
    </IsomorphicApp>
);
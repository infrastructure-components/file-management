import React from 'react';
import {
    Middleware,
    withRequest,
    withIsomorphicState,
    SecuredRoute,
    LISTFILES_MODE,
    serviceWithStorage,
    userLogout,
    withUser
} from 'infrastructure-components';

import { withRouter, useParams } from 'react-router-dom';

import FileList from './file-list';
import UploadForm from './upload-form';
import Page from './page';

import { FILE_STORAGE_ID } from './file-storage';
import { sendEmail } from './file-list-service';

const FolderPage = withUser(withRouter(withIsomorphicState(withRequest(({userId, request, useIsomorphicState, location, ...props}) => {

    return <Page {...props}>
        <FileList pathname={location.pathname} />
        <UploadForm/>
        <button onClick={()=> userLogout("/login")}>Logout</button>
        <button onClick={()=> sendEmail(userId, location.pathname) }>Send list</button>
    </Page>;
}))));

export default function FolderRoute (props) {

    return <SecuredRoute
        path={/^((?!\/(?!(?:\/authentication|\/login|\/filestorage))([$|A-Za-z\-_]+)).)*$/}
        name="Default"
        render={p=><FolderPage {...p}/>}

    >
        <Middleware callback={serviceWithStorage(async (listFiles, req, res, next) => {
            console.log("req: ", req.originalUrl);

            await new Promise((resolve, reject) => {
                listFiles (
                    FILE_STORAGE_ID, //storageId: string,
                    req.originalUrl, //prefix: string,
                    LISTFILES_MODE.FOLDERS, //listMode: string,
                    {}, //data: any,
                    ({data,  folders}) => {
                        // onComplete:

                        console.log("folders: ", folders);
                        res.locals.folders =  folders;
                        resolve(folders);
                    },
                    (err: string) => {
                        console.log(err);
                        reject(err);
                    },

                );
            });

            next();
        })}/>
    </SecuredRoute>

}
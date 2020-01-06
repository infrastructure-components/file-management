import React from 'react';
import { Middleware,  withRequest, withIsomorphicState, Route, LISTFILES_MODE, serviceWithStorage } from 'infrastructure-components';

import { withRouter, useParams } from 'react-router-dom';

import FileList from './file-list';
import UploadForm from './upload-form';
import Page from './page';

import { FILE_STORAGE_ID } from './file-storage';

const FolderPage = withRouter(withIsomorphicState(withRequest(({request, useIsomorphicState, location, ...props}) => {

    /*
    console.log("router data: ", props.location);

    const {foldername} = useParams();
    console.log("foldername: ", foldername)

    const [pathname, setPathname] = useIsomorphicState("pathname", "/");

    if (request && pathname !== request.params["0"]) {
        console.log("request: ", request.params, " -- ", request.query);

        setPathname(request.params["0"]);

    } else {
        console.log("no request")
    }pathname={pathname}
*/
    return <Page {...props}>
        <FileList pathname={location.pathname} />
        <UploadForm/>
    </Page>;
})));

export default function FolderRoute (props) {
    return <Route
        path="*"
        name="Default"
        component={FolderPage}

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
    </Route>

}
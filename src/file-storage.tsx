import React, { useState } from 'react';

import {
    Middleware,
    Storage,
    uploadFile,
    FilesList,
    LISTFILES_MODE,
    mutate,
    serviceWithDataLayer,
    STORAGE_ACTION
} from "infrastructure-components";

import { addMetaData } from './file-meta-data-entry';

export const FILE_STORAGE_ID = "FILESTORAGE";


// create empty context as default
const RefetchContext = React.createContext({});

/**
 * The higher-order-component
 */
export const RefetchProvider = (props) => {

    const [refetch, setRefetch] = useState(undefined);

    return <RefetchContext.Provider
        value={{
            refetch: refetch,
            setRefetch: setRefetch
        }}>{props.children}</RefetchContext.Provider>

};

export function withRefetch(Component) {
    return function WrapperComponent(props) {
        return (
            <RefetchContext.Consumer>
                {(context) => {
                    return <Component
                        {...props}
                        refetch={context.refetch}
                    />
                }}
            </RefetchContext.Consumer>
        );
    };
};

export function withSetRefetch(Component) {
    return function WrapperComponent(props) {
        return (
            <RefetchContext.Consumer>
                {(context) => {
                    return <Component
                        {...props}
                        setRefetch={context.setRefetch}
                    />
                }}
            </RefetchContext.Consumer>
        );
    };
};

export const upload = (prefix, file, onUpload, data) => uploadFile(
    FILE_STORAGE_ID,
    prefix,
    file,
    data,
    //onProgess: (uploaded: number) => Boolean,
    uploaded => {
        const percent_done = Math.floor( ( uploaded / file.size ) * 100 );
        console.log("Uploading File - " + percent_done + "%");
        return true;
    },
    //onComplete: (uri: string) => void,
    uri => onUpload(), //onUpload(uri),

    //onError: (err: string) => void
    err => console.log(err)

);

export const FileStorageList = withSetRefetch((props) => <FilesList
    storageId="FILESTORAGE"
    prefix={props.prefix}
    onSetRefetch={props.setRefetch}
    data={props.data}
    mode={LISTFILES_MODE.FILES}>{props.children}</FilesList>
);

export default function () {
    return <Storage
        id={FILE_STORAGE_ID}
        path="/filestorage"
    >
        <Middleware
            callback={serviceWithDataLayer(async function (dataLayer, req, res, next) {
                const parsedBody = JSON.parse(req.body);

                console.log("this is the service: ", parsedBody.data, parsedBody.action);

                res.locals = parsedBody.data;


                if (parsedBody.action == STORAGE_ACTION.UPLOAD) {

                    if (parsedBody.data) {

                        if (parsedBody.data.author && parsedBody.data.author.toLowerCase() !== "frank") {
                            return res.status(403).set({
                                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                            }).send("not allowed");
                        }

                        await addMetaData(dataLayer, {
                                prefix: parsedBody.prefix,
                                filename: parsedBody.file,
                                author: parsedBody.data.author,
                                description: parsedBody.data.description,
                            }
                        );
                    }

                };

                return next();
            })}
        />
    </Storage>
};
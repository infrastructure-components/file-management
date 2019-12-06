import React, { useState } from 'react';

import {
    Middleware,
    Storage,
    uploadFile,
    FilesList, LISTFILES_MODE
} from "infrastructure-components";


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
            callback={ function (req, res, next) {
                const parsedBody = JSON.parse(req.body);


                console.log("this is the service: ", parsedBody.data);

                res.locals = parsedBody.data;

                next();
            }}
        />
    </Storage>
};
import React, {useState} from 'react';

import styled, { css, withTheme } from 'styled-components';

import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import { File, withRoutes, getFileUrl } from 'infrastructure-components';
import { Link, withRouter } from 'react-router-dom';

import logo from '../assets/logo.png';

import { IMetaData, MetaDataQuery } from './file-meta-data-entry';

import { FileStorageList } from './file-storage';

const bookId = "book";

export const BookFile = () => <File importFrom="../assets/book.pdf" name="book.pdf" id={bookId} />;

const StyledList = withTheme(styled.ul`
    margin: auto;
    width: calc(100% - 2 * ${({theme}) => theme.outerMargin});
    padding-left: 0;
`);

const Head = styled.li`
    padding: 5px;
    color: #888;
    font-weight: bold;
    list-style-type: none;
`;

const Item = styled.li`
    border-top: 1px solid #888;
    list-style-type: none;
`;

const styledLink = css`
    display: block;
    text-decoration: none;
    color: black;
    padding: 5px;
    
`

const FileLink = styled.a`
    ${styledLink}
    &:hover {
        background: #CCC;
    }  
`;


const FolderLink = styled(Link)`
    ${styledLink}
    background: #FFE9A2;
    &:hover {
        background: #AAA;
    }  
`;


const FileEntry = (props) => <Item>
    <FileLink download target="_blank" {...props}/>
    <MetaDataQuery prefix={props.prefix} filename={props.children}>{
        ({loading, fileMetaData, error}) => {
            if (loading) {
                return <div>...Loading...</div>;
            }

            if (fileMetaData) {
                console.log(fileMetaData)
                return <div>{fileMetaData.description} {fileMetaData.author}</div>
            }

            return <div>Error</div>
        }
    }</MetaDataQuery>
</Item>;


const Folder =  (props) => <Item>
    <FolderLink {...props}/>
</Item>;

const SortableFile = SortableElement(FileEntry);

const SortableList = withRouter(withRoutes(SortableContainer(({files, routes, location}) => {

    /** uncomment the second condition to show only direct parents */
    const isParent = (parent, child) => child.startsWith(parent); // && child.substr(parent.length+1).indexOf("/") < 0;

    return (
        <StyledList>
            <Head>Name</Head>
            {

                routes.filter(route => route.path !== location.pathname && (
                        isParent(location.pathname, route.path)||
                        isParent(route.path, location.pathname)
                    )
                ).map((route, index) => (
                    <Folder key={'route-'+index} to={ route.path }>
                    {
                        isParent(route.path, location.pathname) ? ".." : route.name
                    }
                    </Folder>
                ))
            }
            {
                files.filter(
                    item => item.path == location.pathname
                ).map((file, index) => (
                    <SortableFile
                        key={`item-${index}`}
                        index={index}
                        href={file.href}
                        prefix={location.pathname}
                        filename={file.name}/>
                ))
            }
        </StyledList>
    );
})));

const FileList = withRouter((props) => {
    const [fileList, setFiles] = useState([
        /*{
            name: "Index",
            path: "/",
            href: "index.html"
        },{
            name: "App",
            path: "/",
            href: "file-management.bundle.js"
        }, {
            name: "Logo",
            path: "/documents",
            href: logo
        },  {
            name: "Book",
            path: "/documents",
            href: getFileUrl(FILE_STORAGE_ID, bookId)
        }*/
    ]);

    return <FileStorageList prefix={props.location.pathname} data={{hello: "world"}} >{
        ({loading, data, files, error, ...rest}) => {

            if (files && files.length !== fileList.length) {
                setFiles(files.map(item => ({
                    href: item.url,
                    name: item.file,
                    name: item.file,
                    path: props.location.pathname
                })));
            };

            return (loading && <div>Loading</div>) ||
                (error && <div>{error}</div>) ||
                <SortableList distance={2} files={fileList} onSortEnd={
                    ({oldIndex, newIndex}) => {
                        const removed = fileList.slice(0, oldIndex).concat(fileList.slice(oldIndex+1));
                        setFiles(removed.slice(0,newIndex).concat([fileList[oldIndex]]).concat(removed.slice(newIndex)));
                    }
                }/>
        }

    }</FileStorageList>;
});

export default FileList;
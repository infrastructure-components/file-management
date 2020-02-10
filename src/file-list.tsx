import React, {useState} from 'react';

import styled, { css } from 'styled-components';

import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import { File, withRoutes, getFileUrl } from 'infrastructure-components';
import { Link, withRouter } from 'react-router-dom';

import logo from '../assets/logo.png';
//import book from '../assets/book.pdf';

import { FILE_STORAGE_ID } from './file-storage';


const bookId = "book";

export const BookFile = () => <File importFrom="../assets/book.pdf" name="book.pdf" id={bookId} />;

const FileList = styled.ul`
    margin: auto;
    width: calc(100% - 20px);
    padding-left: 0;
`;

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
</Item>;


const Folder =  (props) => <Item>
    <FolderLink {...props}/>
</Item>;

const SortableFile = SortableElement(FileEntry);

const SortableList = withRouter(withRoutes(SortableContainer(({files, routes, location}) => {

    /** uncomment the second condition to show only direct parents */
    const isParent = (parent, child) => child.startsWith(parent); // && child.substr(parent.length+1).indexOf("/") < 0;

    return (
        <FileList>
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
                    <SortableFile key={`item-${index}`} index={index} href={file.href}>{file.name}</SortableFile>
                ))
            }
        </FileList>
    );
})));

export default function () {
    const [files, setFiles] = useState([
        {
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
        }, /* {
            name: "Book",
            path: "/documents",
            href: getFileUrl(FILE_STORAGE_ID, bookId)
        }*/
    ]);

    return <div>
        <SortableList distance={2} files={files} onSortEnd={
            ({oldIndex, newIndex}) => {
                const removed = files.slice(0, oldIndex).concat(files.slice(oldIndex+1));
                setFiles(removed.slice(0,newIndex).concat([files[oldIndex]]).concat(removed.slice(newIndex)));
            }
        }/>

    </div>
};

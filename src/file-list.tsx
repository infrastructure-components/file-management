import React, {useState} from 'react';

import styled from 'styled-components'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import { withRoutes } from 'infrastructure-components';
import { Link, withRouter } from 'react-router-dom';

import logo from '../assets/logo.png';
import book from '../assets/book.pdf';

const FileList = styled.ul`
    margin: 10px;
    width: calc(100% - 20px);
    padding-left: 0;
    list-style-type: none;
`;

const Head = styled.li`
    padding: 5px;
    color: #888;
    font-weight: bold;
`;

const FileItem = styled.li`
    border-top: 1px solid #888;
    list-style-type: none;
`;

const FileLink = styled.a`
    display: block;
    text-decoration: none;
    color: black;
    padding: 5px;
    &:hover {
        background: #CCC;
    }  
`;

const File = (props) => <FileItem>
    <FileLink download target="_blank" {...props}/>
</FileItem>;

const FolderItem = styled(FileItem)`
`;

const FolderLink = styled(Link)`
    display: block;
    text-decoration: none;
    color: black;
    padding: 5px;
    background: #FFE9A2;
    &:hover {
        background: #AAA;
    }  
`;

const Folder =  (props) => <FolderItem>
    <FolderLink {...props}/>
</FolderItem>;

const SortableFile = SortableElement(({href, name}) => <File href={href}>{name}</File>);

const SortableList = withRouter(withRoutes(SortableContainer(({items, routes, location}) => {

    return (
        <FileList>
            <Head>Name</Head>
            {
                routes.filter(route => route.path !== location.pathname && (
                        route.path.startsWith(location.pathname) ||
                        location.pathname.startsWith(route.path)
                    )
                ).map((route, index) => (
                    <Folder key={'route-'+index} to={ route.path }>
                    {
                        location.pathname.startsWith(route.path) ? ".." : route.name
                    }
                    </Folder>
                ))
            }
            {
                items.filter(
                    item => item.path == location.pathname
                ).map((file, index) => (
                    <SortableFile key={`item-${index}`} index={index} href={file.href} name={file.name}/>
                ))
            }
        </FileList>
    );
})));

export default function () {
    const [files, setFiles] = useState([
        {
            name: "Logo",
            path: "/",
            href: logo
        }, {
            name: "Book",
            path: "/documents",
            href: book
        }
    ]);

    return <SortableList distance={2} items={files} onSortEnd={
        ({oldIndex, newIndex}) => {
            const removed = files.slice(0, oldIndex).concat(files.slice(oldIndex+1));
            setFiles(removed.slice(0,newIndex).concat([files[oldIndex]]).concat(removed.slice(newIndex)));
        }
    }/>
};

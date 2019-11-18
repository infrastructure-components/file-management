import React from 'react';

import {
    File,
    Storage
} from "infrastructure-components";

import { BookFile } from './file-list';

export const FILE_STORAGE_ID = "FILESTORAGE";


export default function () {
    return <Storage id={FILE_STORAGE_ID}>
        {/*BookFile />*/}
    </Storage>
}
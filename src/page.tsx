import React from 'react'

import { ThemeProvider } from 'styled-components';
import withStyledTheme from "./styled-theme";
import { RefetchProvider } from './file-storage';



export const Page = withStyledTheme(({styledTheme, children, request}) => {

    return (
        <ThemeProvider theme={styledTheme}>
            <RefetchProvider>
                {children}
            </RefetchProvider>
        </ThemeProvider>
    );
});

export default Page;
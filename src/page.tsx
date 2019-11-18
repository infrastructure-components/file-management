import React from 'react'

import { ThemeProvider } from 'styled-components';
import withStyledTheme from "./styled-theme";


export const Page = withStyledTheme(({styledTheme, children}) => {

    return (
        <ThemeProvider theme={styledTheme}>
            {children}
        </ThemeProvider>
    );
});

export default Page;
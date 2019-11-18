import React from 'react';

export const theme = {
    /* the margin we keep to the frame of the browser window */
    outerMargin: "30px",
};

export default function withStyledTheme(Component) {
    return function (props) {
        return <Component
            {...props}
            styledTheme={theme}
        />;
    };
};

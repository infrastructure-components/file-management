import React from 'react';
import styled, { css, ThemeProvider, withTheme } from 'styled-components';


const MyStyledDiv = withTheme(styled.div`
  margin: auto;
  width: ${props => props.theme.calculateWidth(props.theme, false)};
`);

/*
const MyBorderedStyledDiv = withTheme(styled(MyStyledDiv)`
  border: ${props => props.theme.border} dashed black;
  width: calc(100% - ${props => props.theme.margin} - 2 * ${props => props.theme.border});
`);


const MyGreenBorderedStyledDiv = styled(MyBorderedStyledDiv)`
  ${backgroundStyle};
`;
const MyGreenStyledDiv = styled(MyStyledDiv)`
  ${backgroundStyle};
`;*/
//calc(100% - ${props => props.theme.margin} - 2 * ${border});

const MyGreenStyledDivBorderedWhenFirst = (props) => {
    const border = "2px";
    const C = withTheme(styled(MyStyledDiv)`
      ${props => props.theme.backgroundStyle};
      &:first-of-type {
        border: ${border} dashed black;
        width: ${props => props.theme.calculateWidth(props.theme, border)}
      }
    `);

    return <C {...props}/>
};

const Component = () => <ThemeProvider theme={{
        margin: "40px",
        backgroundStyle: css`
          background: green;
        `,
        calculateWidth: (theme, border) => `calc(100% - ${theme.margin}  - 2 * ${ border ? border : "0px"})`
    }}>

    <MyGreenStyledDivBorderedWhenFirst>
        I have a border and a horizontal margin. I am green.
    </MyGreenStyledDivBorderedWhenFirst>
    <MyGreenStyledDivBorderedWhenFirst>
        I have a horizontal margin. I am green, too.
    </MyGreenStyledDivBorderedWhenFirst>
    <MyStyledDiv>
        I have a horizontal margin.
    </MyStyledDiv>
</ThemeProvider>;

export default Component;
// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react';
import { Global, css } from "@emotion/react";


const GlobalStyle = ({ children }) =>
{
    return (
        <>
            <Global
                styles={css`
            html {
              min-width: 356px;
              scroll-behavior: smooth;
            }
            #__next {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              background: #f7f7f7;
            }
          `}
            />
            {children}
        </>
    );
};

function MyApp({ Component, pageProps })
{
    return (
        <ChakraProvider>
            <GlobalStyle>
                <Component {...pageProps} />
            </GlobalStyle>
        </ChakraProvider>
    );
}

export default MyApp;
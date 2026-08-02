import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
// import { Provider } from "../context/Context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      {/* <Provider> */}
        <Component {...pageProps} />
      {/* </Provider> */}
    </ChakraProvider>
  );
}

export default MyApp;

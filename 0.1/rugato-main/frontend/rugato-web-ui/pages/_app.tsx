import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MyContext, Provider } from "../context/Context";
import { useEffect } from "react";
// import { Provider } from "../context/Context";

function TokenHandler({ children }: { children: React.ReactNode }) {
  const {
    idUser, changeIdUser,
    name, changeName,
    type, changeType,
    username, changeUsername,
    date, changeDate,
  } = MyContext();

  useEffect(() => {
    const storedidUser = localStorage.getItem("idUser");
    const storedname = localStorage.getItem("name");
    const storedtype = localStorage.getItem("type");
    const storedusername = localStorage.getItem("username");
    const storeddate = localStorage.getItem("date");

    if (storedidUser && !idUser) {
      changeIdUser(storedidUser);
    }
    if (storedname && !name) {
      changeName(storedname);
    }
    if (storedtype && !type) {
      changeType(storedtype);
    }
    if (storedusername && !username) {
      changeUsername(storedusername);
    }
    if (storeddate && !date) {
      changeDate(storeddate);
    }
  }, [idUser, changeIdUser, name, changeName, type, changeType, username, changeUsername, date, changeDate]);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ChakraProvider>
        <Provider>
          <TokenHandler>
            <Component {...pageProps} />
          </TokenHandler>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;

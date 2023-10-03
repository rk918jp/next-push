import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react";


const askPermission = () => {
  Notification.requestPermission(function(result) {
    if (result !== "granted") {
      console.log("No notification permission granted!");
    }
  });
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    askPermission();
  }, []);
  return <Component {...pageProps} />
}

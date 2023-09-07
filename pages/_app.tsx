import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { DetailProvider } from './context'

function MyApp({ Component, pageProps }: AppProps) {
  return <DetailProvider>
    <Component {...pageProps} />
  </DetailProvider>
}

export default MyApp

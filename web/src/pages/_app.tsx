import type { AppProps } from 'next/app';
import { ToastProvider, ToastViewport } from '../components/Toast';
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider swipeDirection="right">
      <Component {...pageProps} />
      <ToastViewport />
    </ToastProvider>
  );
}

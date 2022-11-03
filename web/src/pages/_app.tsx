import type { AppProps } from 'next/app';
import { ToastProvider, ToastViewport } from '../components/Toast';
import { AuthProvider } from '../context/AuthContext';
import '../styles/global.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ToastProvider swipeDirection="right">
      <AuthProvider session={session}>
        <Component {...pageProps} />
        <ToastViewport />
      </AuthProvider>
    </ToastProvider>
  );
}

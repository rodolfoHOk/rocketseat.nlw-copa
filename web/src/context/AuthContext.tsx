import { AxiosError } from 'axios';
import { Session } from 'next-auth';
import {
  SessionProvider,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from 'next-auth/react';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { api } from '../lib/api';

interface User {
  id?: string;
  name: string;
  email?: string;
  avatarUrl: string;
}

export interface AuthContextData {
  user: User | null;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
  session: Session;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { data: nextAuthSessionData } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  async function signIn() {
    try {
      setIsUserLoading(true);
      await nextAuthSignIn('google');
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signOut() {
    try {
      await nextAuthSignOut();
      setUser(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const signInWithGoogle = useCallback(async (accessToken: string) => {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', {
        access_token: accessToken,
      });

      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${tokenResponse.data.token}`;

      const userResponse = await api.get('/users/me');
      setUser(userResponse.data.user);
    } catch (error) {
      if (error instanceof AxiosError) {
        await signOut();
        return;
      }
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nextAuthSessionData?.accessToken) {
      signInWithGoogle(nextAuthSessionData.accessToken);
    }
  }, [nextAuthSessionData?.accessToken, signInWithGoogle]);

  return (
    <AuthContext.Provider value={{ user, isUserLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

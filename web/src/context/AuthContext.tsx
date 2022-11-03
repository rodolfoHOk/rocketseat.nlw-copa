import { Session } from 'next-auth';
import {
  SessionProvider,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from 'next-auth/react';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface User {
  id?: string;
  name: string;
  email?: string;
  avatarUrl: string;
}

export interface AuthContextData {
  user: User;
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

  const [user, setUser] = useState<User>({} as User);
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function signInWithGoogle(accessToken: string) {
    console.log('TOKEN AUTENTICAÇÃO ===> ', accessToken);
  }

  useEffect(() => {
    if (nextAuthSessionData?.accessToken) {
      signInWithGoogle(nextAuthSessionData.accessToken);
    }
  }, [nextAuthSessionData]);

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

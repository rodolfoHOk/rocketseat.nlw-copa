import { useContext } from 'react';
import { AuthContext, AuthContextData } from '../context/AuthContext';

export const useAuth = () => useContext<AuthContextData>(AuthContext);

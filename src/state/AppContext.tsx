import { createContext, Dispatch, SetStateAction } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

interface AppContextType {
  user: FirebaseUser | null;
  userData: any | null;
  setAppState: Dispatch<SetStateAction<any>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const defaultContext: AppContextType = {
  user: null,
  userData: null,
  setAppState: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

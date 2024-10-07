import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './state/AppContext';
import { auth } from './config/firebase-config';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserData } from './services/user.service';
import Header from './components/Header/Header';
import RegistrationPage from './views/RegistrationPage/RegistrationPage';
import Home from './views/Home/Home';
import NotFound from './views/NotFound/NotFound';
import ItemsPage from './views/ItemsPage/ItemsPage';
import { UploadItems } from './views/UploadItems/UploadItems';

interface AppState {
  user: FirebaseUser | null;
  userData: any | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    userData: null,
  });

  // useAuthState returns the user object if logged in
  const [user, loading, error] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync the authenticated user to AppContext 
  useEffect(() => {
    if (user && appState.user !== user) {
      setAppState((prevState) => ({ ...prevState, user }));
      console.log('User logged in:', user);
      getUserData(user.uid)
        .then((data) => {
          setAppState((prevState) => ({
            ...prevState,
            userData: data,
          }));
        })
        .catch((e) => {
          console.error('Error fetching user data:', e);
        });
    }
  }, [user, appState.user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user state</div>;

  return (
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState, searchQuery, setSearchQuery }}>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/upload"    element={<UploadItems />} />
            <Route path="/register"  element={<RegistrationPage />} />
            <Route path="/items"     element={<ItemsPage />} />
            <Route path="*"          element={<NotFound />} />            
          </Routes>
        </div>
        <footer>&copy; Online Shop</footer>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

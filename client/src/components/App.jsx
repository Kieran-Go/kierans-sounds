import Loading from './Loading';
import Header from './Header';
import Hero from './Hero';
import MainPlayer from './MainPlayer';
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from './AuthContext';

// Create a new context object
const UIContext = createContext();

// Custom hook for convenience — call useUI for components to access UI states
export function useUI() {
  return useContext(UIContext);
}

export default function App() {
  // Get user and authLoading context
  const { authLoading } = useContext(AuthContext);

  // Set hideMusicPlayer using local storage or default to false if not found
  const [hideMusicPlayer, setHideMusicPlayer] = useState(() => {
    const stored = localStorage.getItem("hideMusicPlayer");
    return stored !== null ? JSON.parse(stored) : false;
  });

  // Set hideSoundGrid using local storage or default to false if not found
  const [hideSoundGrid, setHideSoundGrid] = useState(() => {
    const stored = localStorage.getItem("hideSoundGrid");
    return stored !== null ? JSON.parse(stored) : false;
  });

  // Initialize resetVolumes state trigger
  const [resetVolumes, setResetVolumes] = useState(0);

  // Save hideMusicPlayer to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("hideMusicPlayer", JSON.stringify(hideMusicPlayer));
  }, [hideMusicPlayer]);

  // Save hideSoundGrid to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("hideSoundGrid", JSON.stringify(hideSoundGrid));
  }, [hideSoundGrid]);

  // Render loading component when loading
  if(authLoading) return <Loading />

  return (
    <>
    {/* Wrap child components inside UIContext provider */}
    <UIContext.Provider
    value={{ hideMusicPlayer, setHideMusicPlayer, hideSoundGrid, setHideSoundGrid, resetVolumes, setResetVolumes }}
    >
      {/* Render each UI component */}
      <Header />
      <Hero />
      <MainPlayer />
    </UIContext.Provider>
    </>
  )
}
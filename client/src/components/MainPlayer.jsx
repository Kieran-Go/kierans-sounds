import { useEffect, useState, useContext, createContext } from 'react';
import localData from '../../data/localData';
import useFetchData from '../hooks/useFetchData';
import MusicPlayer from './MusicPlayer';
import SoundGrid from './SoundGrid';
import getStoredSoundVolumes from '../util/getStoredSoundVolumes';
import playBtnImg from '../assets/images/play.svg';
import pauseBtnImg from '../assets/images/pause.svg';
import audioImg from '../assets/images/audio.svg';
import { AuthContext } from './AuthContext';
import '../css/MainPlayer.css';

// Create context for user data in local storage
export const storedDataContext = createContext(null);

export default function MainPlayer() {
    // Get user context
    const { user } = useContext(AuthContext);

    // Initialize states
    const [play, setPlay] = useState(false);
    const [masterVolume, setMasterVolume] = useState(1); // Default to full volume
    const [sounds, setSounds] = useState([]);
    const [songs, setSongs] = useState([]);

    const [storedData, setStoredData] = useState(() => {
        // Get data from local storage
        const stored = localStorage.getItem("userData");
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        // Return the parsed json of local storage data
        return {
            ...parsed,
            // Ensure the sounds and songs arrays exist even if empty
            sounds: parsed.sounds ?? [],
            songs: parsed.songs ?? [],
        };
    });

    // Fetch user data from db if logged in and no stored data
    const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN;
    const { data, loading, error } = useFetchData(
        user && !storedData ? `${serverOrigin}/users` : null
    );

    useEffect(() => {
        // Set document title
        document.title = "Kieran's Sounds";

        // Set master volume if stored
        const storedMaster = localStorage.getItem("masterVolumeStorage");
        if (storedMaster !== null) setMasterVolume(parseFloat(storedMaster));
    },[]);

    useEffect(() => {
        if (data) {
            // Ensure sounds/songs arrays always exist
            const normalized = {
                ...data,
                sounds: data.sounds ?? [],
                songs: data.songs ?? [],
            };
            // Set stored data using fetched data
            setStoredData(normalized);
            localStorage.setItem("userData", JSON.stringify(normalized));
        }
    }, [data]);

    useEffect(() => {
        // Clean up old audio
        [...sounds, ...songs].forEach(s => {
            if (s.audio) {
                s.audio.pause();
                s.audio.src = '';
            }
        });

        // Always initialize local sounds
        const localSounds = initializeAudio(localData, true);

        // Initialize user sounds only if available
        const userSounds = storedData?.sounds ? initializeAudio(storedData.sounds, false) : [];

        // Initialize songs only if available
        const userSongs = storedData?.songs ? initializeAudio(storedData.songs, false) : [];

        setSounds([...userSounds, ...localSounds]);
        setSongs(userSongs);
    }, [storedData]);

    const initializeAudio = (items, isLocal = false) => {
        const storedVolumes = getStoredSoundVolumes();

        return items.map(item => {
            const audio = new Audio(item.url);
            audio.loop = true;
            const volume = storedVolumes[item.id] ?? 0;
            audio.volume = volume;

            return {
                ...item,
                audio,
                isPlaying: false,
                isLocal,
                svg: isLocal ? item.svg : audioImg,
                volume,
            };
        });
    };

    const handleMasterVolumeChange = (e) => {
        // Set new master volume with new input value
        const value = parseFloat(e.target.value);
        setMasterVolume(value);

        // Save master volume to local storage
        localStorage.setItem("masterVolumeStorage", JSON.stringify(value));
    }

    const toggleMasterMute = () => {
        if(masterVolume > 0) setMasterVolume(0);
        else {
            const storedMaster = localStorage.getItem("masterVolumeStorage");
            if (storedMaster !== null) setMasterVolume(parseFloat(storedMaster));
            else setMasterVolume(1);
        }
    }

    if (loading) return <>Loading...</>;
    if(error) throw error;

    return(
        <storedDataContext.Provider value={{storedData, setStoredData}}>
            {/* Render the master volume controller */}
            <div className='master-volume-container'>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => handleMasterVolumeChange(e)}
                />
                <button onClick={() => toggleMasterMute()}>{masterVolume > 0 ? "MUTE" : "UNMUTE"}</button>
            </div>

            {/* Render the play/pause button */}
            <section className="main-player__play-btn" onClick={() => setPlay(!play)}>
                <img src={play ? pauseBtnImg : playBtnImg}/>
            </section>

            {/* Render music player */}
            <MusicPlayer play={play} songs={songs} masterVolume={masterVolume}/>
    
            {/* Render the sound-grid */}
            <SoundGrid play={play} sounds={sounds} setSounds={setSounds} masterVolume={masterVolume}/>
        </storedDataContext.Provider>
    )
}
import '../css/MainPlayer.css';
import { useEffect, useState } from 'react';
import playBtnImg from '../assets/images/play.svg';
import pauseBtnImg from '../assets/images/pause.svg';
import audioImg from '../assets/images/audio.svg';
import localData from '../../data/localData';
import mockDb from '../../data/mockData';

export default function MainPlayer() {
    const [play, setPlay] = useState(false);
    const [sounds, setSounds] = useState([]);

    // Fetch user added data
    const data = mockDb; // Use mock data for now

    // On first mount
    useEffect(() => {
        // Set document title
        document.title = "Kieran's Sounds";

        // Get stored volumes
        const storedVolumes = getStoredVolumes();

        // Clone local sounds and make sure they loop
        const localSounds = localData.map(sound => {
            const storedVolume = storedVolumes[sound.id];
            const volume = storedVolume !== undefined ? storedVolume : 0;

            sound.audio.loop = true;
            sound.audio.volume = volume;
            return { ...sound, isPlaying: false, volume };
        });

        // Format fetched data in the same way as local sounds
        const userSounds = data.sounds.map(sound => {
            const storedVolume = storedVolumes[sound.id];
            const volume = storedVolume !== undefined ? storedVolume : 0;

            const audio = new Audio(sound.url);
            audio.loop = true;
            audio.volume = volume;
            return {
                id: sound.id,
                name: sound.name,
                audio: audio,
                isPlaying: false,
                isLocal: false,
                svg: audioImg, // Use default img for custom sounds
                volume: volume,
            };
        });

        setSounds([...userSounds, ...localSounds]);
    },[])

    // Play/Pause sounds
    useEffect(() => {
        sounds.forEach((sound) => {
            if (sound.audio.volume > 0) {
                if (play && !sound.isPlaying) {
                    sound.audio.play();
                    sound.isPlaying = true;
                } else if (!play && sound.isPlaying) {
                    sound.audio.pause();
                    sound.isPlaying = false;
                }
            }
        });
    }, [play, sounds]);

    // Toggles the play state
    const togglePlay = () => {
        setPlay(!play);
    }

    // Handle when a sound's volume is changed by user
    const handleSoundVolumeChange = (e, index) => {
        const value = parseFloat(e.target.value);
        const newSounds = sounds.map((sound, i) => {
            if (i === index) {
                sound.audio.volume = value; // sync with audio element
                
                // Play/pause based on volume
                if (value > 0 && play) sound.audio.play();
                else sound.audio.pause();

                return { ...sound, volume: value, isPlaying: value > 0 && play };
            }
            return sound;
        });
        setSounds(newSounds);

        // save sound volumes to localStorage 
        const storedVolumes = getStoredVolumes();
        storedVolumes[newSounds[index].id] = value;
        localStorage.setItem("soundVolumeStorage", JSON.stringify(storedVolumes));
    }

    // Function to read local storage for stored volumes
    const getStoredVolumes = () => {
        const stored = localStorage.getItem("soundVolumeStorage");
        return stored ? JSON.parse(stored) : {};
    }

    return(
        <>
        {/* Render the play/pause button */}
        <section className="main-player__play-btn" onClick={() => togglePlay()}>
            <img src={play ? pauseBtnImg : playBtnImg}/>
        </section>
  
        {/* Render the sound-grid */}
        <section className="main-player__sound-grid">
            {sounds.map((sound, index) => (
                <div className={sound.isLocal ? "sound-grid__card" : "sound-grid__card custom"}
                    key={sound.id}>
                    <img src={sound.svg} alt={`${sound.name} icon`} />
                    <p>{sound.name}</p>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={sound.volume}
                        onChange={(e) => handleSoundVolumeChange(e, index)}
                    />
                </div>
            ))}
        </section>
        </>
    )
}
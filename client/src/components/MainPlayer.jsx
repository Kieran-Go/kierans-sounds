import { useEffect, useState } from 'react';
import localData from '../../data/localData';
import mockDb from '../../data/mockData';
import MusicPlayer from './MusicPlayer';
import SoundGrid from './SoundGrid';
import getStoredSoundVolumes from '../util/getStoredSoundVolumes';
import playBtnImg from '../assets/images/play.svg';
import pauseBtnImg from '../assets/images/pause.svg';
import audioImg from '../assets/images/audio.svg';
import '../css/MainPlayer.css';

export default function MainPlayer() {
    const [play, setPlay] = useState(false);
    const [masterVolume, setMasterVolume] = useState(1); // Default to full volume
    const [sounds, setSounds] = useState([]);
    const [songs, setSongs] = useState([]);

    // Fetch user added data
    const data = mockDb; // Use mock data for now

    // On first mount
    useEffect(() => {
        // Set document title
        document.title = "Kieran's Sounds";

        // Set master volume using local storage if exists
        const storedMaster = localStorage.getItem("masterVolumeStorage");
        if(storedMaster !== null) setMasterVolume(parseFloat(storedMaster));

        // Get stored sound volumes
        const storedVolumes = getStoredSoundVolumes();

        // Clone local sounds and make sure they loop
        const localSounds = localData.map(sound => {
            // Get volume data from local storage - or default to 0 if none
            const storedVolume = storedVolumes[sound.id];
            const volume = storedVolume !== undefined ? storedVolume : 0;

            sound.audio.loop = true;
            sound.audio.volume = volume;
            return { ...sound, isPlaying: false, volume };
        });

        // Format fetched sound data in the same way as local sounds
        const userSounds = data.sounds.map(sound => {
            // Get volume data from local storage- or default to 0 if none
            const storedVolume = storedVolumes[sound.id];
            const volume = storedVolume !== undefined ? storedVolume : 0;

            // Create new Audio object for each sound
            const audio = new Audio(sound.url);
            audio.loop = true; // Sounds must loop
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

        // Set the sounds array using user sounds and local sounds
        setSounds([...userSounds, ...localSounds]);

        // Set the songs array using the fetched data - no need to re-format here
        setSongs(data.songs);
    },[]);

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
            if (storedMaster !== null) setMasterVolume(storedMaster);
            else setMasterVolume(1);
        }
    }

    return(
        <>
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
        </>
    )
}
import '../css/MainPlayer.css';
import { useEffect, useRef, useState } from 'react';
import playBtnImg from '../assets/images/play.svg';
import pauseBtnImg from '../assets/images/pause.svg';
import audioImg from '../assets/images/audio.svg';
import localData from '../../data/localData';
import mockDb from '../../data/mockData';

export default function MainPlayer() {
    const [play, setPlay] = useState(false);
    const [sounds, setSounds] = useState([]);
    const [songs, setSongs] = useState([]);
    const [activeSong, setActiveSong] = useState(null);

    const musicPlayerAudio = useRef(new Audio);

    // Fetch user added data
    const data = mockDb; // Use mock data for now

    // On first mount
    useEffect(() => {
        // Set document title
        document.title = "Kieran's Sounds";

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

        // Set the sounds array using user sounds and local sounds
        setSounds([...userSounds, ...localSounds]);

        // Set the songs array using the fetched data - no need to re-format here
        setSongs(data.songs);
    },[])

    // If there are songs in the array, set the first one as active by default
    useEffect(() => {
        if(songs.length > 0) {
            newActiveSong(songs[0]);
        }
    },[songs]);

    useEffect(() => {
        if (activeSong) {
            const audio = activeSong.audio;
            audio.onended = () => nextSong(); // always references latest activeSong
        }
    }, [activeSong]);


    // Play/Pause sounds and music player
    useEffect(() => {
        // Sounds
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

        // Music player song
        if(activeSong && activeSong.volume > 0) {
            if(play && !activeSong.isPlaying) {
                activeSong.audio.play();
                activeSong.isPlaying = true;
            } else if (!play && activeSong.isPlaying) {
                activeSong.audio.pause();
                activeSong.isPlaying = false;
            }
        }
    }, [play, sounds, activeSong]);

    // Toggles the play state
    const togglePlay = () => {
        setPlay(!play);
    }

    // Sets the song param as the new active song object
    const newActiveSong = (song) => {
        // Retrieve music player volume from active storage if exists
        const storedVolume = localStorage.getItem("musicVolumeStorage");
        const volume = storedVolume !== null ? JSON.parse(storedVolume) : (activeSong?.volume || 0);

        // Swap the music player audio references' values
        const audio = musicPlayerAudio.current;
        audio.src = song.url; // Swap to new song source
        audio.volume = volume;

        // Retrieve isPlaying status or default to false
        const isPlaying = activeSong?.isPlaying || false;
        if(isPlaying) audio.play();

        // Create the new active song object and set it
        const newActiveSong = {
            id: song.id,
            name: song.name,
            author: song.author,
            audio: audio,
            volume: volume,
            isPlaying: isPlaying
        }
        setActiveSong(newActiveSong);
    }

    // Switches active song to next in array or wraps around
    const nextSong = () => {
        if (!activeSong || songs.length === 0) return;

        // Find the index of the active song
        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);

        // If current song not found, bail
        if (currentIndex === -1) return;

        // Wrap around if last song, else go to next
        const nextIndex = (currentIndex + 1) % songs.length;
        newActiveSong(songs[nextIndex]);
    }

    // Switches active song to prev in array or wraps arround
    const prevSong = () => {
        if (!activeSong || songs.length === 0) return;

        // Find the index of the active song
        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);

        // If current song not found, bail
        if (currentIndex === -1) return;

        // Wrap around if first song, else go to next
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        newActiveSong(songs[prevIndex]);
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
        const storedVolumes = getStoredSoundVolumes();
        storedVolumes[newSounds[index].id] = value;
        localStorage.setItem("soundVolumeStorage", JSON.stringify(storedVolumes));
    }

    // Handle when the volume for the music player is changed
   const handleMusicVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        if (!activeSong) return;

        const newAudio = activeSong.audio;
        newAudio.volume = value;

        setActiveSong({
            ...activeSong,
            audio: newAudio,
            volume: value,
        });

        // save music player volume to localStorage
        localStorage.setItem("musicVolumeStorage", JSON.stringify(value));
    };

    // Function to read local storage for stored sound volumes
    const getStoredSoundVolumes = () => {
        const stored = localStorage.getItem("soundVolumeStorage");
        return stored ? JSON.parse(stored) : {};
    }

    return(
        <>
        {/* Render the play/pause button */}
        <section className="main-player__play-btn" onClick={() => togglePlay()}>
            <img src={play ? pauseBtnImg : playBtnImg}/>
        </section>

        {/* Render music player */}
        <div className='music-player'>
            <p>MUSIC PLAYER</p>
            <p onClick={() => nextSong()}>next</p>
            <p onClick={() => prevSong()}>prev</p>
            {activeSong && (
                <p>{activeSong.name}{activeSong.author ? ` — ${activeSong.author}` : ''}</p>
            )
            }
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeSong?.volume || 0}
                onChange={(e) => handleMusicVolumeChange(e)}
            />
            <div>

            </div>
        </div>
  
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
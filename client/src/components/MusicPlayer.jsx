import "../css/MusicPlayer.css";
import NewForm from "./NewForm";
import EditSongForm from "./EditSongForm";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useUI } from "./App";
import arrayShuffle from "../util/arrayShuffle";
import nextBtn from "../assets/images/next.svg";
import loopBtn from "../assets/images/loop.svg";
import shuffleBtn from "../assets/images/shuffle.svg";
import addImg from '../assets/images/add.svg';
import editImg from '../assets/images/edit.svg';

export default function MusicPlayer({ songs, play, masterVolume }) {
    // Context
    const { user } = useContext(AuthContext);

    // States
    const [activeSong, setActiveSong] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Initialize using local storage or set to false if not found
    const [loopSong, setLoopSong] = useState(() => {
        const storedState = localStorage.getItem("loopSongStorage");
        return storedState !== null ? JSON.parse(storedState) : false;
    });

    // Initialize using local storage or set to false if not found
    const [shuffle, setShuffle] = useState(() => {
        const shuffleState = localStorage.getItem("shuffleStorage");
        return shuffleState !== null ? JSON.parse(shuffleState) : false;
    });

    const [shuffleQueue, setShuffleQueue] = useState([]); // Songs in the shuffle queue
    const [shuffleHistory, setShuffleHistory] = useState([]); // Shuffled songs already played

    const musicPlayerAudio = useRef(new Audio());
    const { hideMusicPlayer, resetVolumes } = useUI(); // Get ui state

    const emptyPlaylistMessage = user ? 
        "Music player is empty... add some songs!" :
        "Must be logged in to use music player...";

    // Initialize first active song
    useEffect(() => {
        if (songs.length === 0) return;

        if (shuffle) {
            // If on shuffle, shuffle the song array and create the shuffle data
            const shuffled = arrayShuffle(songs);
            setShuffleQueue(shuffled.slice(1)); // Remove first song from queue
            setShuffleHistory([shuffled[0]]); // Add it to the history
            setNewActiveSong(shuffled[0]); // Set it as the first active song
        } else {
            // Set as first index in songs array when not on shuffle
            setNewActiveSong(songs[0]);
        }
    }, [songs]);

    // Handle song onended event
    useEffect(() => {
        if (activeSong) {
            activeSong.audio.onended = () => handleSongEnd();
        }
    }, [activeSong, loopSong, songs]);

    // Play/pause current song
    useEffect(() => {
        if (!activeSong) return;

        if (play && activeSong.volume > 0 && masterVolume > 0) {
            activeSong.audio.play();
            activeSong.isPlaying = true;
        } else {
            activeSong.audio.pause();
            activeSong.isPlaying = false;
        }
    }, [play, activeSong, masterVolume]);

    // Apply master volume multiplier whenever it changes
    useEffect(() => {
        if (activeSong) {
            activeSong.audio.volume = activeSong.volume * masterVolume;
        }
    }, [masterVolume, activeSong]);

    // Reset the music player volume on resetVolumes state trigger
    useEffect(() => {
        if (!activeSong) return;

        // Reset volume
        const audio = activeSong.audio;
        audio.volume = 0;

        // Update state so the slider reflects it
        setActiveSong({
            ...activeSong,
            audio,
            volume: 0,
        });

        // Reset localStorage
        localStorage.setItem("musicVolumeStorage", JSON.stringify(0));
    },[resetVolumes])

    // Sets the new active song as the song param
    const setNewActiveSong = (song) => {
        // Get music player volume from local storage
        const storedVolume = localStorage.getItem("musicVolumeStorage");
        const volume = storedVolume !== null
            ? JSON.parse(storedVolume)
            // If nothing in storage, set as current activeSong volume
            // Or default to 0
            : (activeSong?.volume || 0);

        // Update audio ref with new data
        const audio = musicPlayerAudio.current;
        audio.src = song.url;
        audio.volume = volume;

        // Check if prev audio was already playing play if true
        const isPlaying = activeSong?.isPlaying || false;
        if (isPlaying) audio.play();

        // Set the new active song
        setActiveSong({
            id: song.id,
            name: song.name,
            author: song.author,
            audio,
            volume,
            isPlaying,
        });
    };

    // Handles when a song ends
    const handleSongEnd = () => {
        if (!activeSong || songs.length === 0) return;

        // If loopSong is on, or there is only one song, restart current song instead of going to next
        if (loopSong || songs.length < 2) {
            activeSong.audio.currentTime = 0;
            activeSong.audio.play();
            return;
        }

        // Else call nextSong
        nextSong();
    }

    // Set the new active song to next in the songs array
    const nextSong = () => {
        if (!activeSong || songs.length === 0) return;

        // Let nextShuffle handle logic if shuffle is true
        if(shuffle) {
            nextShuffle();
            return;
        }

        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % songs.length; // Wrap around
        setNewActiveSong(songs[nextIndex]);
    };

    // Set new active song to prev in the songs array
    const prevSong = () => {
        if (!activeSong || songs.length === 0) return;

        // Let prevShuffle handle logic if shuffle is true
        if(shuffle) {
            prevShuffle();
            return;
        }

        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + songs.length) % songs.length; // Wrap around
        setNewActiveSong(songs[prevIndex]);
    };

    // Logic for handling switching to next song while on shuffle
    const nextShuffle = () => {
        if (!activeSong) return;

        if (shuffleQueue.length === 0) {
            // All songs have been played - reshuffle songs
            const shuffled = arrayShuffle(songs);
            const [first, ...restQueue] = shuffled;

            setShuffleQueue(restQueue); // Remaining songs for the new shuffle cycle
            setShuffleHistory([first]); // Start history with first song of new cycle
            setNewActiveSong(first); // Play first song
            return;
        }

        // Pick the next song from the queue
        const [next, ...restQueue] = shuffleQueue;

        setShuffleQueue(restQueue); // Remove next from queue
        setShuffleHistory([...shuffleHistory, next]); // Add to history
        setNewActiveSong(next); // Play it
    };

    // Logic for handling switching to prev song while on shuffle
    const prevShuffle = () => {
        if (!activeSong || shuffleHistory.length <= 1) return;

        // Copy history and queue to avoid mutating state
        const historyCopy = [...shuffleHistory];
        const queueCopy = [...shuffleQueue];

        // Remove current song from history
        const current = historyCopy.pop();

        // The previous song is now the last item in history
        const previous = historyCopy[historyCopy.length - 1];

        if (previous) {
            // Put the current song back at the front of the queue
            setShuffleQueue([current, ...queueCopy]);
            setShuffleHistory(historyCopy);
            setNewActiveSong(previous);
        }
    };

    // Handle when user changes music player volume
    const handleMusicVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        if (!activeSong) return;

        const newAudio = activeSong.audio;
        newAudio.volume = value * masterVolume;

        setActiveSong({
            ...activeSong,
            audio: newAudio,
            volume: value,
        });

        // Save new volume to local storage
        localStorage.setItem("musicVolumeStorage", JSON.stringify(value));
    };

    // Toggle the loopSong state
    const toggleLoop = () => {
        const newLoopState = !loopSong;
        setLoopSong(newLoopState);

        // Save state to local storage
        localStorage.setItem("loopSongStorage", newLoopState);
    }

    // Toggle the shuffle state
    const toggleShuffle = () => {
        const newShuffleState = !shuffle;
        setShuffle(newShuffleState);
        localStorage.setItem("shuffleStorage", newShuffleState);

        if (newShuffleState) {
            // When shuffle is turned on, generate a shuffled list of songs
            const remainingSongs = songs.filter(s => s.id !== activeSong?.id); // Exclude current active song
            setShuffleQueue(arrayShuffle(remainingSongs));
            setShuffleHistory([activeSong].filter(Boolean)); // Put current active song in shuffle history
        } else {
            // Turning shuffle off clears shuffle-specific data
            setShuffleQueue([]);
            setShuffleHistory([]);
        }
    };

    return (
        <>
        {/* Only render if hideMusicPlayer = false */}
        {!hideMusicPlayer && 
        // Render music player elements
        <div className="music-player">
            
            {/* // Add/edit song buttons */}
            <div className="buttons-container">
                <img src={addImg} onClick={() => setShowNewForm(true)} />
                <img src={editImg} onClick={() => setShowEditForm(true)} />
            </div>

            {/* Head */}
            <p className="music-player-head">MUSIC PLAYER</p>
            <div>
                {/* Controls and song info */}
                <img src={nextBtn} onClick={prevSong} className="prev-btn"/>
                {songs.length > 0 && activeSong ? 
                    <p className="song-info"><span>{activeSong.name}{activeSong.author ?
                        // Show author only if exists
                         ` — ${activeSong.author}` : ""}</span></p> :
                         <p className="song-info">{emptyPlaylistMessage}</p>
                }
                <img src={nextBtn} onClick={nextSong} className="next-btn"/>
            </div>

            {/* Loop/shuffle option buttons */}
            <div className="player-options">
                <img className={loopSong ? "loop-btn active" : "loop-btn"} src={loopBtn} alt="Loop button"
                 onClick={() =>toggleLoop()}/>
                <img className={shuffle ? "shuffle-btn active" : "shuffle-btn"} src={shuffleBtn} alt="Shuffle button"
                onClick={() => toggleShuffle()}/>
            </div>

            {/* Volume input */}
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeSong?.volume || 0}
                onChange={handleMusicVolumeChange}
            />
        </div>
        }

        {/* Render the forms */}
        {showNewForm && <NewForm setShowNewForm={setShowNewForm}/>}
        {showEditForm && <EditSongForm songs={songs} setShowEditForm={setShowEditForm} />}
        </>
    );
}
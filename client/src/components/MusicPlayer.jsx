import { useEffect, useRef, useState } from "react";
import "../css/MusicPlayer.css";
import nextBtn from "../assets/images/next.svg";

export default function MusicPlayer({ songs, play, masterVolume }) {
    const [activeSong, setActiveSong] = useState(null);
    const musicPlayerAudio = useRef(new Audio());

    // Initialize first song
    useEffect(() => {
        if (songs.length > 0) {
            setNewActiveSong(songs[0]);
        }
    }, [songs]);

    // Handle song end -> go next
    useEffect(() => {
        if (activeSong) {
            activeSong.audio.onended = () => nextSong();
        }
    }, [activeSong]);

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

    // Set the new active song to next in the songs array
    const nextSong = () => {
        if (!activeSong || songs.length === 0) return;

        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % songs.length; // Wrap around
        setNewActiveSong(songs[nextIndex]);
    };

    // Set new active song to prev in the songs array
    const prevSong = () => {
        if (!activeSong || songs.length === 0) return;

        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + songs.length) % songs.length; // Wrap around
        setNewActiveSong(songs[prevIndex]);
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

    return (
        <div className="music-player">
            <p className="music-player-head">MUSIC PLAYER</p>
            <div>
                <img src={nextBtn} onClick={prevSong} className="prev-btn"/>
                {activeSong && (
                    <p className="song-info"><span>{activeSong.name}{activeSong.author ? ` — ${activeSong.author}` : ""}</span></p>
                )}
                <img src={nextBtn} onClick={nextSong} className="next-btn"/>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={activeSong?.volume || 0}
                onChange={handleMusicVolumeChange}
            />
        </div>
    );
}
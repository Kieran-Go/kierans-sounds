import { useEffect, useRef, useState } from "react";
import "../css/MusicPlayer.css";

export default function MusicPlayer({ songs, play }) {
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

        if (play && activeSong.volume > 0) {
            activeSong.audio.play();
            activeSong.isPlaying = true;
        } else {
            activeSong.audio.pause();
            activeSong.isPlaying = false;
        }
    }, [play, activeSong]);

    const setNewActiveSong = (song) => {
        const storedVolume = localStorage.getItem("musicVolumeStorage");
        const volume = storedVolume !== null
            ? JSON.parse(storedVolume)
            : (activeSong?.volume || 0);

        const audio = musicPlayerAudio.current;
        audio.src = song.url;
        audio.volume = volume;

        const isPlaying = activeSong?.isPlaying || false;
        if (isPlaying) audio.play();

        setActiveSong({
            id: song.id,
            name: song.name,
            author: song.author,
            audio,
            volume,
            isPlaying,
        });
    };

    const nextSong = () => {
        if (!activeSong || songs.length === 0) return;
        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % songs.length;
        setNewActiveSong(songs[nextIndex]);
    };

    const prevSong = () => {
        if (!activeSong || songs.length === 0) return;
        const currentIndex = songs.findIndex((s) => s.id === activeSong.id);
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setNewActiveSong(songs[prevIndex]);
    };

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

        localStorage.setItem("musicVolumeStorage", JSON.stringify(value));
    };

    return (
        <div className="music-player">
            <p>MUSIC PLAYER</p>
            <p onClick={nextSong}>next</p>
            <p onClick={prevSong}>prev</p>
            {activeSong && (
                <p>{activeSong.name}{activeSong.author ? ` — ${activeSong.author}` : ""}</p>
            )}
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
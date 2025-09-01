import { useEffect } from "react";
import getStoredSoundVolumes from "../util/getStoredSoundVolumes";
import '../css/SoundGrid.css';
import { useUI } from "./App";

export default function SoundGrid ({ play, sounds, setSounds, masterVolume }) {
    const { hideSoundGrid, resetVolumes } = useUI(); // Get ui state

    // Play/Pause sounds depending on play state and sound's volume
    useEffect(() => {
        sounds.forEach((sound) => {
            const effectiveVolume = sound.volume * masterVolume;
            sound.audio.volume = effectiveVolume;

            if (effectiveVolume > 0) {
                if (play && !sound.isPlaying) {
                    sound.audio.play();
                    sound.isPlaying = true;
                } else if (!play && sound.isPlaying) {
                    sound.audio.pause();
                    sound.isPlaying = false;
                }
            } else if (sound.isPlaying) {
                sound.audio.pause();
                sound.isPlaying = false;
            }
        });
    }, [play, sounds, masterVolume]);

    // Reset each sound volume on resetVolumes state trigger
    useEffect(() => {
        // Prevents volumes from resetting on page-load
        if(resetVolumes === 0) return;

        // Value to reset volumes to
        const value = 0;

        // Create a new array for state
        const newSounds = sounds.map((sound) => ({
            ...sound,
            volume: value,
            isPlaying: false
        }));

        setSounds(newSounds);

        // Reset audio elements outside of state mapping
        newSounds.forEach((sound) => {
            sound.audio.volume = value;
            sound.audio.pause();
        });

        // Save all volumes to localStorage
        const storedVolumes = getStoredSoundVolumes();
        newSounds.forEach((sound) => {
            storedVolumes[sound.id] = value;
        });
        localStorage.setItem("soundVolumeStorage", JSON.stringify(storedVolumes));

    }, [resetVolumes]);

    // Handle when a sound's volume is changed by user
    const handleSoundVolumeChange = (e, index) => {
        const value = parseFloat(e.target.value);
        const newSounds = sounds.map((sound, i) => {
            if (i === index) {
                const effectiveVolume = value * masterVolume;
                sound.audio.volume = effectiveVolume;

                if (effectiveVolume > 0 && play) sound.audio.play();
                else sound.audio.pause();

                return { ...sound, volume: value, isPlaying: effectiveVolume > 0 && play };
            }
            return sound;
        });
        setSounds(newSounds);

        // save sound volumes to localStorage 
        const storedVolumes = getStoredSoundVolumes();
        storedVolumes[newSounds[index].id] = value;
        localStorage.setItem("soundVolumeStorage", JSON.stringify(storedVolumes));
    }

    return(
        <>
        {!hideSoundGrid && 
            <div className="sound-grid">
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
        </div>
        }
        </>
    );
}
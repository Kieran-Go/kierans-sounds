import { useEffect } from "react";
import getStoredSoundVolumes from "../util/getStoredSoundVolumes";
import '../css/SoundGrid.css';

export default function SoundGrid ({ play, sounds, setSounds, masterVolume }) {
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
    );
}
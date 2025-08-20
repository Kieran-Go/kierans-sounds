// Function to read local storage for stored sound volumes and return as JSON
export default function getStoredSoundVolumes () {
    const stored = localStorage.getItem("soundVolumeStorage");
    return stored ? JSON.parse(stored) : {};
}
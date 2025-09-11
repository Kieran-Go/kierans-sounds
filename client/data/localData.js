// Import sounds locally
import rain from "../src/assets/sounds/rain.mp3";
import waves from "../src/assets/sounds/waves.mp3";
import river from "../src/assets/sounds/river.mp3";
import wind from "../src/assets/sounds/wind.mp3";
import birds from "../src/assets/sounds/birds.mp3";
import fire from "../src/assets/sounds/fire.mp3";

// Icons
import rainSvg from "../src/assets/images/rain.svg";
import wavesSvg from "../src/assets/images/waves.svg";
import riverSvg from "../src/assets/images/river.svg";
import windSvg from "../src/assets/images/wind.svg";
import birdsSvg from "../src/assets/images/birds.svg";
import fireSvg from "../src/assets/images/fire.svg";

// Array of objects to hold data for sounds stored on client-side
const localSounds = [
    {
        id: "local-1",
        name: "RAIN",
        url: rain,
        svg: rainSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-2",
        name: "WAVES",
        url: waves,
        svg: wavesSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-3",
        name: "RIVER",
        url: river,
        svg: riverSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-4",
        name: "WIND",
        url: wind,
        svg: windSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-5",
        name: "BIRDS",
        url: birds,
        svg: birdsSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-6",
        name: "FIRE",
        url: fire,
        svg: fireSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
]

export default localSounds;
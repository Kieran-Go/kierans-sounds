import rainSvg from "../src/assets/images/rain.svg";
import wavesSvg from "../src/assets/images/waves.svg";
import birdsSvg from "../src/assets/images/birds.svg";

// Array of objects to hold data for sounds stored on client-side
const localSounds = [
    {
        id: "local-1",
        name: "RAIN",
        url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486656/rain_ptogum.mp3",
        svg: rainSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-2",
        name: "WAVES",
        url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486693/waves_c5abqs.mp3",
        svg: wavesSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
    {
        id: "local-3",
        name: "BIRDS",
        url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486726/birds_s8iu2p.mp3",
        svg: birdsSvg,
        volume: 0,
        isPlaying: false,
        isLocal: true
    },
]

export default localSounds;
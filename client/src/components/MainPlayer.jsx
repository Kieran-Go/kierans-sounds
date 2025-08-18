import '../css/MainPlayer.css';
import { useState } from 'react';
import playBtnImg from '../assets/images/play.svg';
import pauseBtnImg from '../assets/images/pause.svg';

export default function MainPlayer() {
    const [play, setPlay] = useState(false);

    // Toggles the play state
    const togglePlay = () => {
        setPlay(!play);
    }

    return(
        <>
        {/* Render the play/pause button */}
        <div className="main-player__play-btn" onClick={() => togglePlay()}>
            <img src={play ? pauseBtnImg : playBtnImg}/>
        </div>
        </>
    )
}
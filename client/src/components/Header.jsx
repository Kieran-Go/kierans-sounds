import "../css/Header.css";
import optionsImg from "../assets/images/options.svg";
import sunImg from "../assets/images/sun.svg";
import moonImg from "../assets/images/moon.svg";
import lightOn from "../assets/sfx/lightOn.mp3";
import lightOff from "../assets/sfx/lightOff.mp3";
import { useState, useEffect, useRef } from "react";
import { useUI } from "./App";

export default function Header() {
    const { hideMusicPlayer, setHideMusicPlayer, hideSoundGrid, setHideSoundGrid, setResetVolumes } = useUI();
    const [nightMode, setNightMode] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const optionsRef = useRef(null);
    const optionsBtnRef = useRef(null);

    useEffect(() => {
        // Prevent scrolling when nightMode is active
        document.body.style.overflow = nightMode ? "hidden" : "";

        // Play the corresponding sound effect
        const audio = new Audio(nightMode ? lightOff : lightOn);
        audio.play();
    }, [nightMode]);

    // Close options menu if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target) &&
                optionsBtnRef.current &&
                !optionsBtnRef.current.contains(event.target)
            ) {
                setShowOptions(false);
            }
        }

        // Only attach listener if options menu is shown
        if (showOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Clean up the listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOptions]);


    return (
        <>
            {/* If nightMode is active, render a black screen to encompass the entire app */}
            {nightMode ? (
                <div className="black-screen">
                    <section className="header">
                        <img
                            src={moonImg}
                            className="moon-btn"
                            alt="Toggle night mode"
                            onClick={() => setNightMode(false)}
                        />
                    </section>
                </div>
            ) : ( 
                // Otherwise render the header normally
                <section className="header">
                    <p>SIGN UP</p>
                    <p>LOG IN</p>
                    <img src={optionsImg} ref={optionsBtnRef} className="options-btn" alt="Options" onClick={() => setShowOptions(!showOptions)} />
                    <img
                        src={sunImg}
                        className="sun-btn"
                        alt="Toggle night mode"
                        onClick={() => setNightMode(true)}
                    />
                </section>
            )}

            {/* Render options menu if showOptions is true */}
            {showOptions &&
                <div className="options-menu" ref={optionsRef}>
                    <button onClick={() => setHideMusicPlayer(!hideMusicPlayer)}>
                        {hideMusicPlayer ? "Show Music Player" : "Hide Music Player"}
                    </button>
                    <button onClick={() => setHideSoundGrid(!hideSoundGrid)}>
                        {hideSoundGrid ? "Show Sound Grid" : "Hide Sound Grid"}
                    </button>
                    <button onClick={() => setResetVolumes(prev => prev + 1)}>
                        {"Reset volumes"}
                    </button>
                </div>
            }
        </>
    );
}
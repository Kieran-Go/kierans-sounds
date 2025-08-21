import "../css/Header.css";
import optionsImg from "../assets/images/options.svg";
import sunImg from "../assets/images/sun.svg";
import moonImg from "../assets/images/moon.svg";
import lightOn from "../assets/sfx/lightOn.mp3";
import lightOff from "../assets/sfx/lightOff.mp3";
import { useState, useEffect } from "react";

export default function Header() {
    const [nightMode, setNightMode] = useState(false);

    useEffect(() => {
        // Prevent scrolling when nightMode is active
        document.body.style.overflow = nightMode ? "hidden" : "";

        // Play the corresponding sound effect
        const audio = new Audio(nightMode ? lightOff : lightOn);
        audio.play();
    }, [nightMode]);

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
                    <img src={optionsImg} className="options-btn" alt="Options" />
                    <img
                        src={sunImg}
                        className="sun-btn"
                        alt="Toggle night mode"
                        onClick={() => setNightMode(true)}
                    />
                </section>
            )}
        </>
    );
}
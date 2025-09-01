import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useUI } from "./App";
import Signup from "./Signup";
import Login from "./Login";
import "../css/Header.css";
import optionsImg from "../assets/images/options.svg";
import sunImg from "../assets/images/sun.svg";
import moonImg from "../assets/images/moon.svg";
import lightOn from "../assets/sfx/lightOn.mp3";
import lightOff from "../assets/sfx/lightOff.mp3";

export default function Header() {
    // User context
    const { user } = useContext(AuthContext);

    // UI states/setters
    const { hideMusicPlayer, setHideMusicPlayer, hideSoundGrid, setHideSoundGrid, setResetVolumes } = useUI();
    const [nightMode, setNightMode] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    // UI refs that point to the popup containers
    const signupRef = useRef(null);
    const loginRef = useRef(null);
    const optionsRef = useRef(null);

    // Refs pointing to the buttons that toggle the popups
    const loginBtnRef = useRef(null);
    const signupBtnRef = useRef(null);
    const optionsBtnRef = useRef(null);

    // Custom hook that closes a popup when clicking outside of it
    const useClickOutside = (ref, btnRef, onClickOutside, active = true) => {
        useEffect(() => {
            function handleClickOutside(event) {
                // Check if mousedown/click was outside the popup element and toggle-button
                const clickedOutsidePopup = ref.current && !ref.current.contains(event.target);
                const clickedOutsideButton = btnRef.current && !btnRef.current.contains(event.target);
                // Run the callback if both are true
                if (clickedOutsidePopup && clickedOutsideButton) {
                    onClickOutside();
                }
            }

            // Only listen for outside clicks if this popup is active/open
            if (active) {
                document.addEventListener("mousedown", handleClickOutside);
            }

            // Remove event listener to avoid duplicate listeners and memory leaks
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, onClickOutside, active]);
    }

    // Apply useClickOutside to each toggleable popup
    useClickOutside(signupRef, signupBtnRef, () => setShowSignupForm(false), showSignupForm);
    useClickOutside(loginRef, loginBtnRef, () => setShowLoginForm(false), showLoginForm);
    useClickOutside(optionsRef, optionsBtnRef, () => setShowOptions(false), showOptions);

    // Night mode effect
    useEffect(() => {
        document.body.style.overflow = nightMode ? "hidden" : "";
        const audio = new Audio(nightMode ? lightOff : lightOn);
        audio.play();
    }, [nightMode]);

    const handleLogout = () => {
        // Remove token and user data from storage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        // Refresh pageuse
        window.location.reload();
    }

    return (
        <>
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
                <section className="header">
                    {user ? 
                        <p onClick={() => handleLogout()}>LOG OUT</p> :
                        <> 
                            <p ref={signupBtnRef} onClick={() => setShowSignupForm(!showSignupForm)}>SIGN UP</p>
                            <p ref={loginBtnRef} onClick={() => setShowLoginForm(!showLoginForm)}>LOG IN</p>
                        </>
                    }
                    <img 
                        src={optionsImg} 
                        ref={optionsBtnRef} 
                        className="options-btn" 
                        alt="Options" 
                        onClick={() => setShowOptions(!showOptions)} 
                    />
                    <img
                        src={sunImg}
                        className="sun-btn"
                        alt="Toggle night mode"
                        onClick={() => setNightMode(true)}
                    />
                </section>
            )}

            {showSignupForm && 
                <div ref={signupRef}>
                    <Signup />
                </div>
            }
            {showLoginForm && 
                <div ref={loginRef}>
                    <Login />
                </div>
            }

            {showOptions &&
                <div className="options-menu" ref={optionsRef}>
                    <button onClick={() => setHideMusicPlayer(!hideMusicPlayer)}>
                        {hideMusicPlayer ? "Show Music Player" : "Hide Music Player"}
                    </button>
                    <button onClick={() => setHideSoundGrid(!hideSoundGrid)}>
                        {hideSoundGrid ? "Show Sound Grid" : "Hide Sound Grid"}
                    </button>
                    <button onClick={() => setResetVolumes(prev => prev + 1)}>
                        Reset volumes
                    </button>
                </div>
            }
        </>
    );
}

import { useState } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';

export default function NewForm( { isSong = true, setShowNewForm }) {
    // Input states
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [author, setAuthor] = useState('');

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    // Name length differs dependong in is song
    const maxNameLength = isSong ? 60 : 15;

    async function handleSubmit(e) {
        e.preventDefault();

        // Reset server error message
        setServerErr(null);

        // Return if no token
        const token = localStorage.getItem('token');
        if(!token) {
            setServerErr("Not logged in");
            return;
        }

        // Determine endpoint
        const origin = import.meta.env.VITE_SERVER_ORIGIN;
        const endpoint = isSong ? '/songs' : '/sounds';

        // Build request body
        const body = isSong
            ? { name, url, ...(author ? { author } : {}) }
            : { name, url };

        // Post to backend
        const res = await fetch(`${origin}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // If response is valid, remove stale storage data and reload page
        if(res.ok) {
            localStorage.removeItem('userData');
            window.location.reload();
        }
        else {
            // Else display the server-side error
            setServerErr(data.error || data.message || "Failed to add");
        }
    }

    return (
        <div className='form-overlay'>
            <form className='form' onSubmit={handleSubmit}>
                <h3>NEW {isSong ? "SONG" : "SOUND"}</h3>
                {/* Close button */}
                <img className='close-img' src={closeImg} onClick={() => setShowNewForm(false)} />
                {/* Name input */}
                {nameErr && <p className='input-error'>* {nameErr}</p>}
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Name'
                required
                minLength={3}
                maxLength={maxNameLength}
                onInvalid={(e) => {
                    e.preventDefault();
                    e.target.setCustomValidity(`Name must be between 3-${maxNameLength} characters`);
                    setNameErr(e.target.validationMessage);
                }}
                onInput={(e) => {
                    e.target.setCustomValidity('');
                    setNameErr(null);
                }}
                />
                {/* Author input (only if song) */}
                {isSong && (
                    <>
                        {<p className='optional-message'>* Optional</p>}
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Author"
                        />
                    </>
                )}
                {/* URL input */}
                {urlErr && <p className='input-error'>* {urlErr}</p>}
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="URL"
                    required
                    onInvalid={(e) => {
                        e.preventDefault();
                        e.target.setCustomValidity("Must be a valid URL");
                        setUrlErr(e.target.validationMessage);
                    }}
                    onInput={(e) => {
                        e.target.setCustomValidity('');
                        setUrlErr(null);
                    }}
                />

                {serverErr && <p className='input-error'>* {serverErr}</p>}
                <button type="submit">Submit</button>
            </form>

            {/* URL warning message */}
            <p className='url-message'>
                Important: Please ensure the provided URL is a direct file link (such as from Google Drive or Cloudinary).
                Regular streaming links (YouTube, Spotify, etc.) are not supported.
            </p>
        </div>
    )
}
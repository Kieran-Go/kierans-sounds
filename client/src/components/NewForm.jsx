import { useState, useContext } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';
import { storedDataContext } from './MainPlayer';

export default function NewForm({ isSong = true, setShowNewForm }) {
    // Stored data context
    const { storedData, setStoredData } = useContext(storedDataContext);
    
    // Input states
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [author, setAuthor] = useState('');

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    // Name length differs depending on type
    const maxNameLength = isSong ? 60 : 15;

    async function handleSubmit(e) {
        e.preventDefault();
        setServerErr(null);

        // Use token to verify log-in status
        const token = localStorage.getItem('token');
        if (!token) {
            const type = isSong ? "songs" : "sounds"
            setServerErr(`Must be logged in to add ${type}`);
            return;
        }

        // Get endpoint
        const origin = import.meta.env.VITE_SERVER_ORIGIN;
        const endpoint = isSong ? '/songs' : '/sounds';

        // Form the body
        const body = isSong
            ? { name, url, ...(author ? { author } : {}) }
            : { name, url };

        // Default server-side error message
        const defaultErrMsg = "Something went wrong. Please try again";
        try {
            // Add sound/song to the db
            const res = await fetch(`${origin}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                // Update storedData in context and localStorage
                if (storedData) {
                    const updatedData = {
                        ...storedData,
                        [isSong ? 'songs' : 'sounds']: [
                            data,
                            ...(storedData[isSong ? 'songs' : 'sounds'] || [])
                        ]
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedData));
                    setStoredData(updatedData);
                } else {
                    // fallback to setting new data if nothing exists yet
                    const initialData = {
                        songs: isSong ? [data] : [],
                        sounds: !isSong ? [data] : []
                    };
                    localStorage.setItem('userData', JSON.stringify(initialData));
                    setStoredData(initialData);
                }

                // Close form
                setShowNewForm(false);
            } else {
                // Show server-side error
                setServerErr(data.error || data.message || defaultErrMsg);
            }
        }
        catch(err) {
            setServerErr(defaultErrMsg)
        }
    }

    return (
        <div className='form-overlay'>
            <form className='form' onSubmit={handleSubmit}>
                <h3>NEW {isSong ? "SONG" : "SOUND"}</h3>
                <img className='close-img' src={closeImg} onClick={() => setShowNewForm(false)} />
                
                {/* name input */}
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
                        <p className='optional-message'>* Optional</p>
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
                <button className='submit-btn' type="submit">SUBMIT</button>
            </form>

            {/* URL warning message */}
            <p className='url-message'>
                Please provide a direct audio file URL (e.g., from Cloudinary, AWS S3, or another file host). 
                Links from streaming services such as YouTube or Spotify are not supported.
            </p>
        </div>
    )
}

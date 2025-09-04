import { useState } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';

export default function EditSoundForm({ sound, setSoundToEdit, setShowEditForm }) {
    // Input states
    const [name, setName] = useState(sound.name);
    const [url, setUrl] = useState(sound.audio.src);

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    const closeForm = () => {
        setSoundToEdit(null);
        setShowEditForm(false);
    }

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

        // Build body
        const body = { name: name, url: url };

        // Get endpoint
        const endpoint = `${import.meta.env.VITE_SERVER_ORIGIN}/sounds/${sound.id}`;
        console.log(endpoint);
        // PUT to backend
        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // If response is valid, remove stale storage data and reload page
        if(res.ok) {
            localStorage.removeItem('userData');
            // window.location.reload();
        }
        else {
            // Else display the server-side error
            setServerErr(data.error || data.message || "Failed to add");
        }
    }

    return(
        
        <div className='form-overlay'>
            <form className='form' onSubmit={handleSubmit}>
                <h3>EDIT SOUND</h3>
                {/* Close button */}
                <img className='close-img' src={closeImg} onClick={() => closeForm()} />
                {/* Name input */}
                {nameErr && <p className='input-error'>* {nameErr}</p>}
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.target.select()}
                placeholder='Name'
                required
                minLength={3}
                maxLength={15}
                onInvalid={(e) => {
                    e.preventDefault();
                    e.target.setCustomValidity(`Name must be between 3-15 characters`);
                    setNameErr(e.target.validationMessage);
                }}
                onInput={(e) => {
                    e.target.setCustomValidity('');
                    setNameErr(null);
                }}
                />
                {/* URL input */}
                {urlErr && <p className='input-error'>* {urlErr}</p>}
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={(e) => e.target.select()}
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
        </div>
    )
}
import { useState, useContext } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';
import { storedDataContext } from './MainPlayer';

export default function EditSoundForm({ sound, setSoundToEdit, setShowEditForm }) {
    // Input states
    const [name, setName] = useState(sound.name);
    const [url, setUrl] = useState(sound.audio.src);

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    // Stored data context
    const { storedData, setStoredData } = useContext(storedDataContext);

    const origin = import.meta.env.VITE_SERVER_ORIGIN;

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
        const endpoint = `${origin}/sounds/${sound.id}`;

        // PUT to backend
        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // If response is valid, update storage to match updated data
        if(res.ok) {
            if (storedData && storedData.sounds) {
                // Build updated data
                const updatedData = {
                    ...storedData,
                    sounds: storedData.sounds.map(s =>
                        s.id === sound.id ? { ...s, name, url } : s
                    ),
                };

                // Update both localStorage and context
                localStorage.setItem('userData', JSON.stringify(updatedData));
                setStoredData(updatedData);

                // Close the form
                closeForm();
            }
            else {
                // If there is no data in local storage: reload page instead
                window.location.reload();
            }
        }
        else {
            // Else display the server-side error
            setServerErr(data.error || data.message || "Failed to edit");
        }
    }

    async function deleteSound(e) {
        e.preventDefault();
        // Confirm deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this sound?");
        if (!confirmDelete) return;

        // Get token
        const token = localStorage.getItem('token');
        if (!token) {
            setServerErr("Not logged in");
            return;
        }

        // Get endpoint
        const endpoint = `${origin}/sounds/${sound.id}`;

        // DELETE sound
        const res = await fetch(endpoint, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // Get deleted sound data from response
        const data = await res.json();

        // If response is valid, update storage to match updated data
        if(res.ok) {
            if (storedData && storedData.sounds) {
                // Find deleted data and remove it from local storage
                const updatedData = {
                    ...storedData,
                    sounds: storedData.sounds.filter(s => s.id !== sound.id)
                };

                // Update both localStorage and context
                localStorage.setItem('userData', JSON.stringify(updatedData));
                setStoredData(updatedData);

                // Close the form
                closeForm();
            }
            else {
                // If there is no data in local storage: reload page instead
                window.location.reload();
            }
        }
        else {
            // Else display the server-side error
            setServerErr(data.error || data.message || "Failed to delete");
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
                <button className='submit-btn' type="submit">SUBMIT</button>
                <button className='delete-btn' type='button' onClick={(e)=> deleteSound(e)}>DELETE</button>
            </form>
        </div>
    )
}
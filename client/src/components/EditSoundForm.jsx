import { useState, useContext } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';
import { storedDataContext } from './MainPlayer';
import { putJson, deleteJson } from '../util/fetchUtility';

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

    // Close the form
    const closeForm = () => {
        setSoundToEdit(null);
        setShowEditForm(false);
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent default submit behavior
        setServerErr(null); // Reset sever error message

        // Use token to verify log-in status
        const token = localStorage.getItem('token');
        if(!token) {
            setServerErr("Must be logged in to edit sounds");
            return;
        }

        // PUT to backend
        try {
            const body = { name: name, url: url }; // Build body
            
            // Put request
            await putJson(`/sounds/${sound.id}`, body, { token });

            // Update stored data
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
        catch (err) {
            // Display the server-side error
            setServerErr(err.data?.error || err.data?.message || "Something went wrong.");
        }
    }

    // Handle deletion of sound
    async function deleteSound(e) {
        e.preventDefault(); // Prevent default submit behavior

        // Confirm deletion with user
        const confirmDelete = window.confirm("Are you sure you want to delete this sound?");
        if (!confirmDelete) return;

        // Use token to verify log-in status
        const token = localStorage.getItem('token');
        if (!token) {
            setServerErr("Must be logged in to delete sounds");
            return;
        }

        // DELETE sound
        try{
            // Delete request
            await deleteJson(`/sounds/${sound.id}`, { token });

            // Update stored data
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
        catch (err) {
            // Display the server-side error
            setServerErr(err.data?.error || err.data?.message || "Something went wrong.");
        }
    }

    return(
        // Overlay for form
        <div className='form-overlay'>
            {/* Render the form elements */}
            <form className='form' onSubmit={handleSubmit}>
                {/* Form header */}
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

                {/* Server-side error */}
                {serverErr && <p className='input-error'>* {serverErr}</p>}

                {/* Submit and delete buttons */}
                <button className='submit-btn' type="submit">SUBMIT</button>
                <button className='delete-btn' type='button' onClick={(e)=> deleteSound(e)}>DELETE</button>
            </form>
        </div>
    )
}
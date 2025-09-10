import { useState, useContext, useEffect } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';
import { storedDataContext } from './MainPlayer';
import { putJson, deleteJson } from '../util/fetchUtility';

export default function EditSongForm({ songs, setShowEditForm }) {
    // Init states
    const [songToEdit, setSongToEdit] = useState(null);
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [editMessage, setEditMessage] = useState(null);

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    // Init context and server origin
    const { storedData, setStoredData } = useContext(storedDataContext);

    // Default selected song to first in array
    useEffect(() => {
        if(songs.length > 0) {
            setSongToEdit(songs[0]);
        }
    },[]);

    // Change fields when selected song is changed
    useEffect(() => {
        if(!songToEdit) return;
        setName(songToEdit.name);
        setAuthor(songToEdit.author);
        setUrl(songToEdit.url);
        setEditMessage(null);
        setNameErr(null);
        setUrlErr(null);
    },[songToEdit]);

    // Handle submission of the form
    async function handleSubmit(e) {
        e.preventDefault(); // prevent default behavior
        setServerErr(null); // Reset server error message

        // Use token to verify log-in status
        const token = localStorage.getItem('token');
        if(!token) {
            setServerErr("Must be logged in to edit songs");
            return;
        }

        // PUT song
        try{
            // Build body
            const body = { name: name, author: author ? author : null, url: url };

            // Put request
            await putJson(`/songs/${songToEdit.id}`, body, { token });

            // Update stored data
            if(storedData && storedData.songs) {
                // Build updated data
                const updatedData = {
                    ...storedData,
                    songs: storedData.songs.map(s => 
                        s.id === songToEdit.id 
                        ? { id: s.id, name, author, url }
                        : { id: s.id, name: s.name, author: s.author, url: s.url }
                    )
                };
                // Update both localStorage and context
                localStorage.setItem('userData', JSON.stringify(updatedData));
                setStoredData(updatedData);

                // Show confirmation to user
                setEditMessage(`${songToEdit.name} edited successfully!`)
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

    async function deleteSound(e) {
        e.preventDefault(); // Prevent default behavior

        // Confirm deletion with user
        const confirmDelete = window.confirm("Are you sure you want to delete this song?");
        if (!confirmDelete) return;

        // Use token to verify log-in status
        const token = localStorage.getItem('token');
        if (!token) {
            setServerErr("Must be logged in to delete songs");
            return;
        }

        // DELETE song
        try{
            // Delete request
            await deleteJson(`/songs/${songToEdit.id}`, { token })

            // Update stored data
            if (storedData && storedData.songs) {
                // Find deleted data and remove it from local storage
                const updatedData = {
                    ...storedData,
                    songs: storedData.songs.filter(s => s.id !== songToEdit.id)
                };

                // Update both localStorage and context
                localStorage.setItem('userData', JSON.stringify(updatedData));
                setStoredData(updatedData);

                // Display delete message to user
                setEditMessage(`${songToEdit.name} deleted successfully`)
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
        // Form overlay
        <div className='form-overlay'>

            {/* Render form elements */}
            <form className='form' onSubmit={handleSubmit}>
                {/* Form header */}
                <h3>EDIT SONGS</h3>

                {/* Close button */}
                <img className='close-img' src={closeImg} onClick={() => setShowEditForm(false)} />

                {/* Song selection container */}
                <div className='songs-container'>
                    {/* Iterate through each song and add them to the container */}
                    {songs.length > 0 ? (
                        songs.map((song) => (
                            // Add the selected css class if song is selected
                            <p key={song.id} className={song === songToEdit ? 'song selected' : 'song'}
                                onClick={() => setSongToEdit(song)}>
                                {song.name}
                            </p>
                        ))
                    ) : (
                        // Display a message if no songs in the array
                        <p className='empty-songs-msg'>No songs to edit...</p>
                    )}
                </div>

                {/* Render form if songs in the array */}
                {songs.length > 0 && (
                <>
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
                        maxLength={60}
                        onInvalid={(e) => {
                            e.preventDefault();
                            e.target.setCustomValidity(`Name must be between 3-60 characters`);
                            setNameErr(e.target.validationMessage);
                        }}
                        onInput={(e) => {
                            e.target.setCustomValidity('');
                            setNameErr(null);
                        }}
                    />

                    {/* Author input */}
                    <p className='optional-message'>* Optional</p>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Author"
                        onFocus={(e) => e.target.select()}
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

                    {/* Display a message after editing the song */}
                    {editMessage && <p className='edit-msg'>{editMessage}</p>}

                    {/* Server-side error message */}
                    {serverErr && <p className='input-error'>* {serverErr}</p>}

                    {/* Subit and delete buttons */}
                    <button className='submit-btn' type="submit">SUBMIT</button>
                    <button className='delete-btn' type='button' onClick={(e)=> deleteSound(e)}>DELETE</button>
                </>
            )}
            </form>
        </div>
    )
}
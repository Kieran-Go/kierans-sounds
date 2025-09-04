import { useState, useContext, useEffect } from 'react';
import '../css/Form.css';
import closeImg from '../assets/images/close.svg';
import { storedDataContext } from './MainPlayer';

export default function EditSongForm({ songs, setShowEditForm }) {
    // Init states
    const [songToEdit, setSongToEdit] = useState(null);
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    // Error message states
    const [nameErr, setNameErr] = useState(null);
    const [urlErr, setUrlErr] = useState(null);
    const [serverErr, setServerErr] = useState(null);

    // Init context and server origin
    const { storedData, setStoredData } = useContext(storedDataContext);
    const origin = import.meta.env.VITE_SERVER_ORIGIN;

    useEffect(() => {
        if(songs.length > 0) {
            setSongToEdit(songs[0]);
        }
    },[]);

    useEffect(() => {
        if(!songToEdit) return;
        setName(songToEdit.name);
        setAuthor(songToEdit.author);
        setUrl(songToEdit.url);
    },[songToEdit]);

    async function handleSubmit(e) {
        e.preventDefault();
    }

    async function deleteSound(e) {
        e.preventDefault();
    }

    return(
        <div className='form-overlay'>
            <form className='form' onSubmit={handleSubmit}>
                <h3>EDIT SONGS</h3>
                {/* Close button */}
                <img className='close-img' src={closeImg} onClick={() => setShowEditForm(false)} />

                {/* Song selection container */}
                <div className='songs-container'>
                    {songs.length > 0 ? (
                        songs.map((song) => (
                            <p key={song.id} className={song === songToEdit ? 'song selected' : 'song'}
                                onClick={() => setSongToEdit(song)}>
                                {song.name}
                            </p>
                        ))
                    ) : (
                        <p className='empty-songs-msg'>Music player is empty...</p>
                    )}
                </div>

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

                    {serverErr && <p className='input-error'>* {serverErr}</p>}
                    <button className='submit-btn' type="submit">SUBMIT</button>
                    <button className='delete-btn' type='button' onClick={(e)=> deleteSound(e)}>DELETE</button>
                </>
            )}
            </form>
        </div>
    )
}
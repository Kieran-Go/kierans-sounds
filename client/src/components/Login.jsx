import { useState } from 'react';
import '../css/userForm.css';

export default function Login() {
  // Initialize input and error states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Handle clicking the submit button
  async function handleSubmit(e) {
    e.preventDefault();

    // Reset server error message
    setServerError(null);

    // Fetch /auth/login endpoint
    const res = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    // Set data as fetch response
    const data = await res.json();

    // If response is valid, store token in storage and reload page
    if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.reload();
    } else {
        // Else display the server-side error
        setServerError(data.error || data.message || "Login failed");
    }
  } 

  return (
    <form className='user-form' onSubmit={handleSubmit}>
      {usernameError && <p className='input-error'>* {usernameError}</p>}  
      <input 
        type="text" 
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
        required
        minLength={3}
        maxLength={50}
        onInvalid={(e) => {
            e.preventDefault(); // stop default tooltip
            e.target.setCustomValidity("Username must be 3–50 characters"); // set custom validity message
            setUsernameError(e.target.validationMessage); // use validity message
        }}
        onInput={(e) => {
            e.target.setCustomValidity(""); // clear previous custom validity
            setUsernameError(null); // clear error message
        }}
      />

      {passwordError && <p className='input-error'>* {passwordError}</p>}
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required
        minLength={8}
        maxLength={50}
        onInvalid={(e) => {
            e.preventDefault(); // stop default tooltip
            e.target.setCustomValidity("Password must be 8–50 characters"); // set custom validity message
            setPasswordError(e.target.validationMessage); // use validity message
        }}
        onInput={(e) => {
            e.target.setCustomValidity(""); // clear previous custom validity
            setPasswordError(null); // clear error message
        }}
      />
      {serverError && <p className='input-error'>* {serverError}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

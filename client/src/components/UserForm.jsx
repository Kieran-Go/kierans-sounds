import '../css/userForm.css';
import { useState } from 'react';
import { postJson } from '../util/fetchUtility';

export default function UserForm({ mode = "login" }) {
  // Input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Error states
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Determine endpoint and button label
  const isSignup = mode === "signup";
  const endpoint = isSignup ? "/auth/signup" : "/auth/login";
  const buttonText = isSignup ? "Sign up" : "Login";

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default submit behavior
    setServerError(null); // Reset server error

    // If in signup mode: verify the confirmation password
    if (isSignup && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // Attempt signup/login with POST req
    try{
      // Build body
      const body = { username, password };
      
      // Post request
      const data = await postJson(endpoint, body, {});

      // Store token and reload page
      localStorage.setItem('token', data.token);
      window.location.reload();
    } 
    catch (err) {
      // Display the server-side error
      setServerError(err.data?.error || err.data?.message || "Something went wrong.");
    }
  }

  return (
    <form className='user-form' onSubmit={handleSubmit} role={mode === "login" ? 'login-form' : 'signup-form'}>
      {/* Username */}
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
          e.preventDefault();
          e.target.setCustomValidity("Username must be 3–50 characters");
          setUsernameError(e.target.validationMessage);
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
          setUsernameError(null);
        }}
      />

      {/* Password */}
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
          e.preventDefault();
          e.target.setCustomValidity("Password must be 8–50 characters");
          setPasswordError(e.target.validationMessage);
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
          setPasswordError(null);
        }}
      />

      {/* Confirm Password (only in signup) */}
      {isSignup && (
        <>
          {confirmPasswordError && (
            <p className='input-error'>* {confirmPasswordError}</p>
          )}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            minLength={8}
            maxLength={50}
            onInvalid={(e) => {
              e.preventDefault();
              e.target.setCustomValidity("Must be 8–50 characters");
              setConfirmPasswordError(e.target.validationMessage);
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
              setConfirmPasswordError(null);
            }}
          />
        </>
      )}

      {/* Server error */}
      {serverError && <p className='input-error'>* {serverError}</p>}

      {/* Button */}
      <button type="submit">{buttonText}</button>
    </form>
  );
}
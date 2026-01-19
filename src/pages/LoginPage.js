import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { setStoredAuth } from '../auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      setStoredAuth({ username, password });
      const redirectTo = location.state?.from?.pathname || '/patients';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      setErrorMessage(status === 401 ? 'Invalid username or password.' : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign in</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
            required
          />
        </label>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p style={styles.helper}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '420px',
    margin: '40px auto',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  title: {
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontWeight: '600',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2f6fed',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: '#c62828',
    fontWeight: '600',
  },
  helper: {
    marginTop: '16px',
  },
};

export default LoginPage;

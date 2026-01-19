import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

const ROLE_OPTIONS = ['ADMIN', 'STAFF', 'HEAD_DOCTOR', 'DOCTOR', 'PATIENT'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'PATIENT',
    patientId: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setFormState((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const payload = {
      username: formState.username,
      password: formState.password,
      fullName: formState.fullName || undefined,
      role: formState.role,
    };

    if (formState.role === 'PATIENT' && formState.patientId) {
      payload.patientId = Number(formState.patientId);
    }

    try {
      await register(payload);
      navigate('/login', { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        setErrorMessage('Registration failed. Username might be taken.');
      } else if (status === 404) {
        setErrorMessage('Registration failed. Patient not found.');
      } else {
        setErrorMessage('Registration failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register user</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Username
          <input
            type="text"
            value={formState.username}
            onChange={handleChange('username')}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password
          <input
            type="password"
            value={formState.password}
            onChange={handleChange('password')}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Full name
          <input
            type="text"
            value={formState.fullName}
            onChange={handleChange('fullName')}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Role
          <select
            value={formState.role}
            onChange={handleChange('role')}
            style={styles.input}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        {formState.role === 'PATIENT' && (
          <label style={styles.label}>
            Patient ID
            <input
              type="number"
              value={formState.patientId}
              onChange={handleChange('patientId')}
              style={styles.input}
            />
          </label>
        )}
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={styles.helper}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '480px',
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

export default RegisterPage;

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your inbox for further instructions');
    } catch (err) {
      setError('Failed to reset password');
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Password Reset</h2>
      {error && <div className="alert-error">{error}</div>}
      {message && <div className="alert-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button disabled={loading} type="submit" className="btn-primary">
          Reset Password
        </button>
      </form>
      <div className="text-center mt-3">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
} 
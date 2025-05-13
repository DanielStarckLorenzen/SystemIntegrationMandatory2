import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { updateEmail, updatePassword } from 'firebase/auth';

export default function UpdateProfile() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');
    setMessage('');

    if (email !== currentUser?.email && currentUser) {
      promises.push(updateEmail(currentUser, email));
    }

    if (password && currentUser) {
      promises.push(updatePassword(currentUser, password));
    }

    Promise.all(promises)
      .then(() => {
        setMessage('Profile updated successfully');
        setTimeout(() => navigate('/'), 1500);
      })
      .catch(() => {
        setError('Failed to update profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="card">
      <h2>Update Profile</h2>
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
            defaultValue={currentUser?.email || ''}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password <span className="text-muted">(Leave blank to keep the same)</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password-confirm">
            Confirm Password <span className="text-muted">(Leave blank to keep the same)</span>
          </label>
          <input
            type="password"
            id="password-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button disabled={loading} type="submit" className="btn-primary">
          Update
        </button>
      </form>
      <div className="text-center mt-3">
        <Link to="/">Cancel</Link>
      </div>
    </div>
  );
} 
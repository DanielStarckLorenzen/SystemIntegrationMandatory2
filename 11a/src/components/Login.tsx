import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await logIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in');
      console.error(err);
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Log In</h2>
      {error && <div className="alert-error">{error}</div>}
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
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button disabled={loading} type="submit" className="btn-primary">
          Log In
        </button>
      </form>
      
      <div className="divider">or</div>
      
      <div className="social-login">
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading} 
          className="btn-google"
        >
          Sign in with Google
        </button>
      </div>
      
      <div className="text-center mt-3">
        <div>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div className="mt-2">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
} 
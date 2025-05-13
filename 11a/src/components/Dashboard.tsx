import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');

    try {
      await logOut();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <div className="card">
      <h2>Profile</h2>
      {error && <div className="alert-error">{error}</div>}
      <div className="profile-info">
        <strong>Email:</strong> {currentUser?.email}
        {currentUser?.displayName && (
          <div>
            <strong>Name:</strong> {currentUser.displayName}
          </div>
        )}
        {currentUser?.photoURL && (
          <div className="avatar">
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              width="100" 
              height="100" 
            />
          </div>
        )}
      </div>
      <div className="action-buttons">
        <button 
          onClick={() => navigate('/update-profile')} 
          className="btn-secondary"
        >
          Update Profile
        </button>
        <button 
          onClick={handleLogout} 
          className="btn-danger"
        >
          Log Out
        </button>
      </div>
    </div>
  );
} 
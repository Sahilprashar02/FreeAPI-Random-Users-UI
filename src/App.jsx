import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Calendar, Globe } from 'lucide-react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.freeapi.app/api/v1/public/randomusers?page=${pageNumber}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      if (result.success) {
        setUsers(result.data.data);
        setTotalPages(result.data.totalPages);
      } else {
        throw new Error(result.message || 'Error fetching users');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="container">
        <header className="header">
          <h1>Global Citizens</h1>
          <p>Discover interesting profiles from around the world using the FreeAPI Random Users endpoint.</p>
        </header>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Fetching profiles...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button className="btn" onClick={() => fetchUsers(page)} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="users-grid">
              {users.map((user) => (
                <div key={user.login.uuid} className="user-card">
                  <div className="card-header">
                    <div className="avatar-wrapper">
                      <img 
                        src={user.picture.large} 
                        alt={`${user.name.first} ${user.name.last}`} 
                        className="avatar"
                      />
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h2 className="user-name">
                      {user.name.title} {user.name.first} {user.name.last}
                    </h2>
                    <div className="user-username">@{user.login.username}</div>
                    
                    <div className="info-list">
                      <div className="info-item">
                        <Mail size={16} />
                        <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
                      </div>
                      <div className="info-item">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={16} />
                        <span>{user.location.city}, {user.location.country}</span>
                      </div>
                      <div className="info-item">
                        <Calendar size={16} />
                        <span>Joined {formatDate(user.registered.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="status-badge">
                      <span className="status-dot"></span>
                      Active
                    </div>
                    <div className="nat-badge" title="Nationality">
                      <Globe size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {user.nat}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button 
                className="btn" 
                onClick={handlePrev} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page <strong style={{color: 'var(--text-primary)'}}>{page}</strong> of {totalPages}
              </span>
              <button 
                className="btn" 
                onClick={handleNext} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;

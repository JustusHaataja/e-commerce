import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const ProfilePage = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return <div className="login-page" >Ladataan...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="login-page" >
            <div className="login-container" >
                <h2>Profiili</h2>
                <div className="form-group" >
                    <label>Nimi</label>
                    <p>{user.name}</p>
                </div>
                <div className="form-group" >
                    <label>Sähköposti</label>
                    <p>{user.email}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="submit-btn"
                    style={{ backgroundColor: '#d32f2f' }}
                >
                    Kirjaudu ulos
                </button>
            </div>
        </div>
    );
};

export default ProfilePage
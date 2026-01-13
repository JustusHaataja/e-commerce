import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import '../styles/LoginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 10) {
            return "Salasanan tulee olla vähintään 10 merkkiä pitkä";
        }
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(pwd)) {
            return "Salasanan tulee sisältää vähintään yksi erikoismerkki";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isLogin) {
            // Validate password strength
            const passwordError = validatePassword(password);
            if (passwordError) {
                setError(passwordError);
                return;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                setError("Salasanat eivät täsmää");
                return;
            }
        }

        try {
            if (isLogin) {
                await login({ email, password });
                navigate("/"); // Redirect to home after login
            } else {
                await register({ name, email, password });
                
                // Start fade-out transition
                setIsTransitioning(true);
                
                // Show success message after fade-out
                setTimeout(() => {
                    setSuccess("Rekisteröityminen onnistui!");
                    setIsTransitioning(false);
                }, 300);
                
                // Transition to login after showing success
                setTimeout(() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsLogin(true);
                        setPassword("");
                        setConfirmPassword("");
                        setName("");
                        setSuccess("");
                        setIsTransitioning(false);
                    }, 300);
                }, 6000);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Tapahtui virhe");
        }
    };

    return (
        <div className="login-page" >
            <div className={`login-container ${isTransitioning ? 'fade-out' : 'fade-in'}`} >
                <h2>{isLogin ? "Kirjaudu sisään" : "Rekisteröidy"}</h2>
                {error && <div className="error-message" >{error}</div>}
                {success && 
                    <div className="success-message" >
                        {success}
                        <FontAwesomeIcon 
                            icon={faCircleCheck} 
                            id="checkmark"
                        />
                    </div>}
                
                {!success && (
                    <>
                        <form onSubmit={handleSubmit} >
                            {!isLogin && (
                                <div className="form-group" >
                                    <label htmlFor="name" >Nimi</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group" >
                                <label htmlFor="email" >Sähköposti</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" >
                                <label htmlFor="password" >Salasana</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {!isLogin && (
                                    <small className="password-hint" >
                                        Vähintään 10 merkkiä ja yksi erikoismerkki
                                    </small>
                                )}
                            </div>
                            {!isLogin && (
                                <div className="form-group" >
                                    <label htmlFor="confirmPassword" >Vahvista salasana</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <button type="submit" className="submit-btn" >
                                {isLogin ? "Kirjaudu" : "Rekisteröidy"}
                            </button>
                        </form>
                        <p className="toggle-text" >
                            {isLogin ? "Eikö sinulla ole tiliä?" : "Onko sinulla jo tili?"}
                            <button
                                className="toggle-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Rekisteröidy tästä" : "Kirjaudu tästä"}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage
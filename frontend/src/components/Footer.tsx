import '../styles/Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faGithub, faApplePay, faGooglePay, faPaypal, faCcVisa } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer>
            <div className="footer-top" >
                <div>
                    <h1>
                        Yhteystiedot
                    </h1>
                    <p>
                        010 338 8700 <br /> ark. 9.00 - 16.00
                    </p>
                    <p>
                        asiakaspalvelu@puhdistamo.fi
                    </p>
                </div>

                <div>
                    <h1>
                        Maksutavat
                    </h1>
                    <div className="banking-container" >
                        <FontAwesomeIcon 
                            icon={faApplePay}
                            className="banking-icon"
                        />
                        <FontAwesomeIcon 
                            icon={faGooglePay}
                            className="banking-icon"
                        />
                        <FontAwesomeIcon 
                            icon={faCcVisa}
                            className="banking-icon"
                        />
                        <FontAwesomeIcon 
                            icon={faPaypal}
                            className="banking-icon"
                        />
                    </div>
                </div>

                <div>
                    <h1>
                        Meidät löydät myös
                    </h1>

                    <div className="social-container" >
                        <Link 
                            to="https://www.instagram.com/puhdistamo/" 
                            className="social-link"
                            >
                                <FontAwesomeIcon 
                                    icon={faInstagram}
                                    className="social-icon"
                                />
                        </Link>
                        <Link 
                            to="https://www.tiktok.com/@puhdistamoofficial"
                            className="social-link"
                            >
                                <FontAwesomeIcon 
                                    icon={faTiktok}
                                    className="social-icon"
                                />
                        </Link>
                        <Link 
                            to="https://github.com/JustusHaataja/Projects"
                            className="social-link"
                            >
                                <FontAwesomeIcon 
                                    icon={faGithub}
                                    className="social-icon"
                                />
                        </Link>
                    </div>
                    
                    <div>
                        <Link 
                            to="https://www.puhdistamo.fi/"
                            className="website-link"
                        >
                            Puhdistamo.fi
                        </Link>
                    </div>
                </div>
  
            </div>

            <div className="footer-bottom" >
                © {new Date().getFullYear()} Tämä ei ole Puhdistamon virallinen nettisivu.
            </div>
        </footer>
    )
}

export default Footer
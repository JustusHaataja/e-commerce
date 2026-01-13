import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faBriefcase, faHandshake } from '@fortawesome/free-solid-svg-icons';
import '../styles/ContactPage.css';

const ContactPage = () => {

    const customerServiceTeam = [
        {
            name: "Laura Tarmo",
            role: "Asiakaspalvelupäällikkö",
            email: "laura.tarmo@example.com"
        },
        {
            name: "Ronja Soinio",
            role: "Asiakaspalvelija",
            email: "asiakaspalvelu@example.com",
        },
        {
            name: "Tiina Penttilä-Metso",
            role: "Asiakaspalvelija",
            email: "asiakaspalvelu@example.com",
        }
    ]

    return (
        <div className="contact-page" >

            {/* Contact Info Box */}
            <section className="contact-info-section" >
                <img 
                    src="https://www.puhdistamo.fi/cdn/shop/files/pure_1824_4_1681x.jpg?v=1725021288" 
                    alt="Contact background"
                    className="contact-background-image"
                />
                <div className="contact-overlay" ></div>
                <div className="contact-info-box" >
                    <div className="info-item" >
                        <FontAwesomeIcon icon={faPhone} className="info-icon" />
                        <h4 id="header4" >Ota yhteyttä</h4>
                        <p className="phone-number" >010 338 8700</p>
                        <p className="call-price" >8,35 snt/puhelu + 16,69 snt/min</p>
                        <p className="service-hours" >Palvelemme arkipäivisin 9.00 - 16.00</p>
                    </div>
                </div>
            </section>

            {/* Business Options */}
            <section className="business-options-section" >
                <h2 className="section-header2" >Liiketoimintamahdollisuudet</h2>
                <div className="business-cards" >
                    <div className="business-card" >
                        <FontAwesomeIcon icon={faBriefcase} className="business-icon" />
                        <h3>Avoimet työpaikat</h3>
                        <p>Tutustu avoimiin työpaikkoihimme ja liity tiimiimme</p>
                        <Link to="https://rekry.puhdistamo.fi/" className="business-btn" >
                            Puhdistamon urasivulle
                        </Link>
                    </div>
                    <div className="business-card" >
                        <FontAwesomeIcon icon={faHandshake} className="business-icon" />
                        <h3>Ryhdy jälleenmyyjäksi</h3>
                        <p>Tarjoamme kilpailukykyisiä jälleenmyyjäehtoja</p>
                        <Link to="http://pro.puhdistamo.fi/pages/lukittu" className="business-btn" >
                            Puhdistamon Hyvinvointimaailmaan
                        </Link>
                    </div>
                </div>
            </section>

            {/* Customer Service Team */}
            <section className="customer-service-section" >
                <h2 className="section-header2" >Asiakaspalvelumme</h2>
                <div className="team-grid" >
                    {customerServiceTeam.map((member, index) => (
                        <div key={index} className="team-member">
                            <h5 className="header5" >{member.name}</h5>
                            <p className="role" >{member.role}</p>
                            <a href={`mailto:${member.email}`} className="email-link" >
                                <FontAwesomeIcon icon={faEnvelope} />
                                {member.email}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Billing Information */}
            <section className="billing-section" >
                <div className="billing-content" >
                    <div className="billing-image" >
                        <img 
                            src="https://www.puhdistamo.fi/cdn/shop/files/download_13_1200x.webp?v=1725268783" 
                            alt="Office building"
                        />
                    </div>
                    <div className="billing-info" >
                        <h2 className="billing-header" >Puhdistamon laskutustiedot</h2>
                        <div className="billing-details" >
                            <div className="billing-method" >
                                <h3 className="option-header" >Vaihtoehto 1 - Verkkolaskutus</h3>
                                <div className="detail-item" >
                                    <strong>Verkkolaskutustunnus:</strong>
                                    <p>003723743464</p>
                                </div>
                                <div className="detail-item" >
                                    <strong>Verkkolaskutusoperaattori:</strong>
                                    <p>OpusCapita Solutions Oy</p>
                                </div>
                                <div className="detail-item" >
                                    <strong>Välittäjätunnus:</strong>
                                    <p>E204503</p>
                                </div>
                            </div>

                            <div className="billing-method" >
                                <h3 className="option-header" >Vaihtoehto 2 - PDF Sähköpostilasku</h3>
                                <p className="billing-note" >
                                    Mikäli sinulla ei ole mahdollisuutta lähettää sähköistä laskua, 
                                    lähetä valmis PDF-lasku sähköpostilla osoitteeseen:
                                    puhdistamo.FI.P.156168-7@docinbound.com<br /><br />
                                    DF-laskussa tulee olla vastaanottajan osoitetietona:<br />
                                    Puhdistamo - Real Foods Oy<br />
                                    PL 12617<br />
                                    01051 LASKUT
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
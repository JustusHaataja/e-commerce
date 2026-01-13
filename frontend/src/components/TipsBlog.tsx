import { useState } from 'react';
import '../styles/TipsBlog.css';

interface BlogPost {
    id: number;
    title: string;
    preview: string;
    content: string;
    imageUrl: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Energiajuomat - kofeiini tekee hyvää",
        preview: "Kofeiini parantaa keskittymistä ja suorituskykyä",
        content: `
            <h2>Energiajuomat - kofeiini tekee hyvää</h2>
            <p>Kofeiini on yksi maailman eniten käytetyistä stimulanteista. Se parantaa keskittymiskykyä, valppautta ja fyysistä suorituskykyä.</p>
            <h3>Kofeiinin hyödyt:</h3>
            <ul>
                <li>Parantaa kognitiivista suorituskykyä</li>
                <li>Lisää energiatasoja</li>
                <li>Auttaa fyysisessä harjoittelussa</li>
                <li>Voi parantaa mielialaa</li>
            </ul>
            <p>Muista kuitenkin nauttia kofeiinia kohtuudella - suositeltu päivittäinen määrä on noin 400mg aikuisille.</p>
        `,
        imageUrl: "https://www.puhdistamo.fi/cdn/shop/articles/unnamed_e70b3724-6828-4a44-880d-06b800eea08a.jpg?v=1739361801"
    },
    {
        id: 2,
        title: "Viisi yleistä nesteytysmyyttiä",
        preview: "Totuus nesteen tarpeen takana",
        content: `
            <h2>Viisi yleistä nesteytysmyyttiä</h2>
            <p>Nesteytys on tärkeää, mutta sen ympärillä on monia väärinkäsityksiä.</p>
            <h3>Myytit:</h3>
            <ol>
                <li><strong>Kahdeksan lasia päivässä kaikille</strong> - Nesteen tarve vaihtelee yksilön mukaan</li>
                <li><strong>Kahvi ja tee kuivattavat</strong> - Kohtuullinen kulutus ei aiheuta kuivumista</li>
                <li><strong>Vasta jano kertoo tarpeesta</strong> - Jano on jo kuivumisen merkki</li>
                <li><strong>Vesi on ainoa hyvä lähde</strong> - Hedelmät ja vihannekset nesteyttävät myös</li>
                <li><strong>Enemmän on aina parempi</strong> - Liika nesteytys voi olla haitallista</li>
            </ol>
        `,
        imageUrl: "https://www.puhdistamo.fi/cdn/shop/articles/unnamed_95be44f1-7982-4992-9ff8-d2b416783927.jpg?v=1739362952"
    },
    {
        id: 3,
        title: "Miten estää elektrolyyttien paakkuuntuminen",
        preview: "Säilytysvinkkejä elektrolyyttijauheille",
        content: `
            <h2>Miten estää elektrolyyttien paakkuuntuminen</h2>
            <p>Elektrolyyttijauheen paakkuuntuminen on yleinen ongelma, mutta se on estettävissä.</p>
            <h3>Parhaat säilytystavat:</h3>
            <ul>
                <li><strong>Kuiva paikka</strong> - Säilytä viileässä ja kuivassa</li>
                <li><strong>Tiivis säilytys</strong> - Pidä purkki hyvin suljettuna</li>
                <li><strong>Ei jääkaappiin</strong> - Lämpötilavaihtelut aiheuttavat kosteutta</li>
                <li><strong>Kuiva lusikka</strong> - Käytä aina kuivaa annoslusikkaa</li>
                <li><strong>Silica-pussit</strong> - Lisää kosteutta imevä pussi purkkiin</li>
            </ul>
            <p>Jos jauhe on jo paakkuuntunut, voit rikkoa paakut haarukalla tai sekoittimella.</p>
        `,
        imageUrl: "https://www.puhdistamo.fi/cdn/shop/articles/unnamed_0aa49fc5-d750-4884-b984-55af98b692e4.jpg?v=1755591148"
    }
];

const TipsBlog = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const openPost = (post: BlogPost) => {
        setSelectedPost(post);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closePost = () => {
        setSelectedPost(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <section className="tips-blog-section" >
                <h2 className="section-title" >Vinkit hyvinvointiin</h2>
                
                <div className="blog-grid">
                    <div 
                        className="blog-card large"
                        style={{ backgroundImage: `url(${blogPosts[0].imageUrl})` }}
                        onClick={() => openPost(blogPosts[0])}
                    >
                        <div className="blog-card-overlay" >
                            <h3>{blogPosts[0].title}</h3>
                            <p>{blogPosts[0].preview}</p>
                        </div>
                    </div>

                    <div className="blog-small-grid" >
                        {blogPosts.slice(1).map(post => (
                            <div 
                                key={post.id}
                                className="blog-card small"
                                style={{ backgroundImage: `url(${post.imageUrl})` }}
                                onClick={() => openPost(post)}
                            >
                                <div className="blog-card-overlay" >
                                    <h3>{post.title}</h3>
                                    <p>{post.preview}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal Overlay */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={closePost}>
                    <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="blog-modal-close" onClick={closePost}>
                            ✕
                        </button>
                        <div 
                            className="blog-modal-body"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default TipsBlog
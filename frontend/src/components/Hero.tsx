import '../styles/Hero.css';
import ScaleTransition from './ScaleTransition';
import products1 from '../assets/products1.jpg';
import products2 from '../assets/products2.jpg';
import products3 from '../assets/products3.jpg';

import { useState } from 'react';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: products2,
        text: "Löydä suosikki juomasi",
        button: "Juomat",
        link: "/products?category_id=1",
        bgColor: "rgb(226, 120, 69)",
        position: "center 60%"
    },
    {
        image: products3,
        text: "Puhdasta voimaa",
        button: "Proteiinit",
        link: "/products?category_id=4",
        bgColor: "rgb(173, 237, 242)",
        position: "center"
    },
    {
        image: products1,
        text: "Puhdasta energiaa päivään",
        button: "Nesteytys",
        link: "/products?category_id=2",
        bgColor: "rgb(243, 204, 198)",
        position: "center 90%"
    }
]

const Hero = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div 
            className="hero-container"
            style={{ backgroundColor: slides[activeIndex].bgColor }}
        >
            <Swiper
                modules={[ Autoplay, Navigation ]}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false}}
                speed={800}
                navigation={true}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i} >
                        <div className="slide-grid">
                            <div className="hero-left">
                                <p className="slider-text" >
                                    {slide.text}
                                </p>

                                <Link
                                    to={slide.link}
                                    className="link-button"
                                    aria-label="Link to a slider product"
                                >
                                    {slide.button}
                                </Link>
                            </div>
                            <div className="hero-right" >
                                <ScaleTransition
                                    src={slide.image}
                                    active={i === activeIndex}
                                    position={slide.position}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Hero
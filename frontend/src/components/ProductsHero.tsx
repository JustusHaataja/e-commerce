import type React from 'react';
import '../styles/ProductsHero.css';

const productImages = {
    energy_drink1: "https://www.puhdistamo.fi/cdn/shop/files/natural-energy-drink-pineapple-crush-strong-330-ml_800x.png?v=1754982155",
    energy_drink2: "https://www.puhdistamo.fi/cdn/shop/files/natural-energy-drink-raspberry-strong-330-ml-292386_800x.png?v=1727858048",
    electrolyte1: "https://www.puhdistamo.fi/cdn/shop/files/elektrolyyttijauhe-sitruuna-cola-240-g_800x.png?v=1745995810",
    electrolyte2: "https://www.puhdistamo.fi/cdn/shop/files/daily-elektrolyyttijauhe-vesimeloni-100-g_800x.png?v=1744096917",
    kombucha1: "https://www.puhdistamo.fi/cdn/shop/files/luomu-kombucha-vadelma-400-ml-156343_800x.png?v=1727858043",
    kombucha2: "https://www.puhdistamo.fi/cdn/shop/files/luomu-kombucha-goji-passion-400-ml-482963_800x.png?v=1727858039",
    protein1: "https://www.puhdistamo.fi/cdn/shop/files/heraproteiini-vanilja-500-g-157125_800x.png?v=1727858026",
    protein2: "https://www.puhdistamo.fi/cdn/shop/files/optimal-vege-proteiini-mansikka-600-g-695020_800x.png?v=1727858115",
}


const ProductsHero = () => {
    return (
        <div className="prod-hero-container" >
            <div className="prod-slider" style={{ "--quantity": 8} as React.CSSProperties} >
                <div className="item" 
                    style={{ "--position": 1} as React.CSSProperties} >
                        <img 
                            src={productImages.energy_drink1} 
                            alt="Picture of energy drink"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 2} as React.CSSProperties} >
                        <img 
                            src={productImages.electrolyte1} 
                            alt="Picture of electrolytes"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 3} as React.CSSProperties} >
                        <img 
                            src={productImages.kombucha1} 
                            alt="Picture of kombucha"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 4} as React.CSSProperties} >
                        <img 
                            src={productImages.protein1} 
                            alt="Picture of protein bag"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 5} as React.CSSProperties} >
                        <img 
                            src={productImages.energy_drink2} 
                            alt="Picture of energy drink"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 6} as React.CSSProperties} >
                        <img 
                            src={productImages.electrolyte2} 
                            alt="Picture of electrolytes"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 7} as React.CSSProperties} >
                        <img 
                            src={productImages.kombucha2} 
                            alt="Picture of kombucha"
                        />
                    </div>
                <div className="item" 
                    style={{ "--position": 8} as React.CSSProperties} >
                        <img 
                            src={productImages.protein2} 
                            alt="Picture of protein bag"
                        />
                    </div>
            </div>
            <h1 className="prod-header" >TUOTTEET</h1>
        </div>
    )
}

export default ProductsHero
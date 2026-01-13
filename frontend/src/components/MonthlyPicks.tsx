import { useEffect, useState } from 'react';
import { fetchAllProducts, type Product } from '../api/products';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';
import '../styles/MonthlyPicks.css';

const MonthlyPicks = () => {
    const [picks, setPicks] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPicks = async () => {
            try {
                const allProducts = await fetchAllProducts();

                const randomPicks = [...allProducts]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 10);

                setPicks(randomPicks);
            } catch (error) {
                console.error("Failed to load monthly picks", error);
            } finally {
                setLoading(false);
            }
        }

        loadPicks();
    }, [])

    // Don't render section at all if no picks after loading
    if (!loading && picks.length === 0) return null;

    // Create placeholder array with same length as final picks
    const placeholderArray = Array(10).fill(null);
    const displayItems = loading ? placeholderArray : picks;

    return (
        <div className="monthly-picks-section" >
            <h2 className="section-title" >Kuukauden nostot</h2>

            <div className="marquee-container" >
                <div className="marquee-track" >
                    {[...displayItems, ...displayItems].map((product, index) => (
                        <div className="carousel-item" key={index} >
                            {loading ? (
                                <div className="product-card product-skeleton-card">
                                    <Skeleton skel_width="100%" skel_height="200px" />
                                </div>
                            ) : (
                                <ProductCard product={product} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MonthlyPicks
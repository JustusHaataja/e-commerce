import { useEffect, useState } from 'react';
import { fetchCategories, type Category } from '../api/categories';
import { Link } from 'react-router-dom';
import CategorySkeleton from './CategorySkeleton';
import '../styles/Category.css';

import electrolytes from '../assets/electrolytes3.jpg';
import kombucha from '../assets/kombucha3.jpg';
import energydrink from '../assets/energydrink.jpg';
import protein from '../assets/protein.jpg';


const CATEGORY_IMAGES: Record<number, string> = {
    1: energydrink,
    2: electrolytes,
    3: kombucha,
    4: protein
}


const getGategoryImage = (id: number) => {
    return CATEGORY_IMAGES[id];
}


const capitalize = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const Categories = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // AbortController allows us to cancel the API request if the component
        // is removed from the DOM (no longer needed)
        const controller = new AbortController();

        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchCategories(controller.signal);
                setCategories(data);
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") return;

                console.error("Failed to load categories", err);
                setError("Failed to load categories. Please refresh the page");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCategories();
        
        // Cleanup function: cancels request if component unmounts
        return () => controller.abort();
    }, []);

    if (loading) return <CategorySkeleton />;
    if (error) return <div className="error-message" >{error}</div>
    if (!categories) return null;

    return (
        <div className="category-section" >
            <h2 className="section-title" >Kategoriat</h2>

            <div className="category-container" >
                {categories?.map((cat) => (
                    <Link 
                        to={`/products?category_id=${cat.id}`}
                        className="category-link" 
                        key={cat.id}
                    >
                        <div className="image-frame">
                            <img 
                                className="category-image"
                                src={getGategoryImage(cat.id)}
                                alt={`Image of ${cat.name}, on click move to ${cat.name} page`}
                            />
                        </div>
                        <p 
                            className="category-text"
                            aria-label={`On click move to ${cat.name} page`}
                        >
                            {capitalize(cat.name)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Categories
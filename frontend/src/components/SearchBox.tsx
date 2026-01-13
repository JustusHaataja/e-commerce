import '../styles/SearchBox.css';
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';
import { fetchAllProducts, type Product } from '../api/products';
import { useCart } from '../context/CartContext';


interface SearchBoxProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { addToCart, loading: cartLoading } = useCart();


    // Prevent body scroll when search is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    
    // Search products when value changes
    useEffect(() => {
        const searchProducts = async () => {
            if (value.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const products = await fetchAllProducts();
                const filtered = products
                    .filter(p => 
                        p.name.toLowerCase().includes(value.toLowerCase())
                    )
                    .slice(0, 6); // Limit to 6 results
                setSearchResults(filtered);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            searchProducts();
        }
    }, [value, isOpen]);

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    };

    const handleAddToCart = async (productId: number) => {
        try {
            await addToCart(productId);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    return (
        <>
            {/* Overlay backdrop */}
            {isOpen && <div className="search-overlay" onClick={handleClose} />}

            <div className={`searchbox-container ${isOpen ? 'open' : ''}`}>
                <div className="search-input-wrapper" >
                    <input 
                        className="search-input-box"
                        type="text"
                        placeholder="Hae tuotteita..."
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        aria-label="Search products"
                    />
                    <FontAwesomeIcon 
                        className="search-icon"
                        icon={faMagnifyingGlass}
                    />
                    {isOpen && (
                        <button 
                            className="search-close-btn"
                            onClick={handleClose}
                            aria-label="Close search"
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {isOpen && (
                    <div className="search-results" >
                        {loading ? (
                            <div className="search-loading" >Haetaan...</div>
                        ) : searchResults.length > 0 ? (
                            <div className="results-list" >
                                {searchResults.map(product => {
                                    const price = product.sale_price || product.price;
                                    const image = product.images[0]?.image_url || '';
                                    
                                    return (
                                        <div key={product.id} className="search-result-item">
                                            <Link 
                                                to={`/products/${product.id}`}
                                                className="result-link"
                                                onClick={handleClose}
                                            >
                                                <img 
                                                    src={image} 
                                                    alt={product.name}
                                                    className="result-image"
                                                />
                                                <div className="result-info">
                                                    <h4>{product.name}</h4>
                                                    <div className="result-price">
                                                        {product.sale_price ? (
                                                            <>
                                                                <span className="sale-price">{product.sale_price}</span>
                                                                <span className="original-price">{product.price}</span>
                                                            </>
                                                        ) : (
                                                            <span>{price} €</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                            <button
                                                className="result-add-btn"
                                                onClick={() => handleAddToCart(product.id)}
                                                disabled={cartLoading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : value.trim().length >= 2 ? (
                            <div className="search-empty" >Ei tuloksia haulle "{value}"</div>
                        ) : (
                            <div className="search-empty" >Kirjoita vähintään 2 merkkiä</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchBox
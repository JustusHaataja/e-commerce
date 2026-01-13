import { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import {type Product} from '../api/products';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);

    const defaultImage = product.images.length > 0 ? product.images[0].image_url : "";
    const hoverImage = product.images.length > 1 ? product.images[1].image_url : null;
    
    const productUrl = `/products/${product.id}`;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAnimating) return;

        setIsAnimating(true);

        // Run API call and Animation timer in parallel
        // The await Promise.all ensures we wait for whichever takes LONGER:
        // 1. The actual API call
        // 2. The 1200ms timer
        try {
            await Promise.all([
                addToCart(product.id),
                new Promise(resolve => setTimeout(resolve, 1200))
            ]);
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setIsAnimating(false);
        }
    }

    return (
        <div className="product-card" >
            <Link to={productUrl} className="product-image-container" >
                <img
                    src={defaultImage}
                    alt={product.name}
                    loading="lazy"
                    className="product-image default"
                />
                {hoverImage && (
                    <img 
                        src={hoverImage} 
                        alt={product.name}
                        loading="lazy"
                        className="product-image hover"
                    />
                )}
            </Link>
            <div className="card-details" >
                <Link to={productUrl} className="product-title">
                    <h3>{product.name}</h3>
                </Link>
                {product.sale_price ? (
                    <div className="price-container" >
                        <span className="sale-price" >{product.sale_price}</span>
                        <span className="original-price" >{product.price}</span>
                    </div>
                ) : (
                    <p className="price" >{product.price}</p>
                )}
                
                <button 
                    className={`add-btn ${isAnimating ? 'loading' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAnimating} 
                >
                    {isAnimating ? <div className="spinner" ></div> : "OSTA"}
                </button>
            </div>
        </div>
    )
}

export default ProductCard